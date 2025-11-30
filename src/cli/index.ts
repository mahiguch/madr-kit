#!/usr/bin/env node

/**
 * MADR CLI - Main entry point
 * Routes to appropriate command handler
 */

import { Command } from 'commander';
import { MADRInitializer } from '../services/madr-initializer.js';
import { DecisionCreator } from '../services/decision-creator.js';
import { Questionnaire } from './questionnaire.js';

const program = new Command();
const packageJson = {
  version: '0.1.0',
  description:
    'MADR Decision Command - Setup MADR projects and create architectural decision records',
};

program
  .name('madrkit')
  .description(packageJson.description)
  .version(packageJson.version)
  .option('-f, --force', 'Reinitialize even if already initialized')
  .option('-o, --output <dir>', 'Specify decisions directory', 'docs/decisions')
  .option(
    '-t, --template <path>',
    'Use custom template file',
    '.madrkit/templates/decision-template.md'
  )
  .option('-q, --quiet', 'Suppress non-error output')
  .option('-j, --json', 'Output results in JSON format')
  .action(async (options) => {
    try {
      const initializer = new MADRInitializer(options.output, '.madrkit/templates');

      // Check if already initialized
      const isInitialized = await initializer.detectInitialization();

      if (!isInitialized || options.force) {
        // Initialize project
        if (!options.quiet) {
          console.log('Initializing MADR project...\n');
        }

        const result = await initializer.initialize({
          outputDir: options.output,
          templateDir: '.madrkit/templates',
          force: options.force,
        });

        if (result.success) {
          if (options.json) {
            console.log(
              JSON.stringify(
                {
                  success: true,
                  message: result.message,
                  projectState: result.projectState,
                },
                null,
                2
              )
            );
          } else if (!options.quiet) {
            console.log(`\n${result.message}`);
            console.log('\nReady to create your first decision record.');
          }
          process.exit(0);
        } else {
          throw new Error(result.message);
        }
      } else {
        // Already initialized, create decision record
        if (!options.quiet) {
          console.log('\nCreating new decision record...\n');
        }

        const questionnaire = new Questionnaire(options.output);
        const answers = await questionnaire.prompt();

        if (!options.quiet) {
          console.log('');
        }

        const decisionRecord = await questionnaire.convertToDecisionRecord(answers);
        const creator = new DecisionCreator(options.output, options.template);
        const createdInfo = await creator.createDecision(decisionRecord, {
          templatePath: options.template,
        });

        if (options.json) {
          console.log(
            JSON.stringify(
              {
                success: true,
                decisionRecord: {
                  number: createdInfo.number,
                  title: createdInfo.title,
                  filePath: createdInfo.filePath,
                  createdAt: createdInfo.createdAt,
                },
              },
              null,
              2
            )
          );
        } else if (!options.quiet) {
          console.log(`✓ Decision record created successfully!`);
          console.log(`  File: ${createdInfo.filePath}`);
          console.log(`  Number: ${String(createdInfo.number).padStart(3, '0')}`);
          console.log(`  Title: ${createdInfo.title}`);
        }

        process.exit(0);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (options.json) {
        console.error(
          JSON.stringify(
            {
              success: false,
              error: message,
            },
            null,
            2
          )
        );
      } else {
        console.error(`Error: ${message}`);
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
