import { exit } from 'process';
import { FileReader } from './file-reader';
import chalk from 'chalk';
import { ContentAnalyzer } from './analyzer';

const WORDS_HISTOGRAM_MINIMUM = 10;
class DataExtractor {
  private fileReader: FileReader;
  private filePath: string;
  private analyzer: ContentAnalyzer;
  constructor(filePath: string) {
    this.fileReader = new FileReader();
    this.filePath = filePath;
    this.analyzer = new ContentAnalyzer();
  }

  async generateDataReport() {
    const contentData = await this.fileReader.readData(this.filePath);
    if (contentData) {
      const analysisResults = await this.analyzer.analyze(contentData);

      console.clear();
      console.log();
      console.log();
      console.log('═══════════════════');
      console.log('Letters count:'.padEnd(16, ' ') + chalk.green(analysisResults.lettersCount));
      console.log('Spaces count:'.padEnd(16, ' ') + chalk.green(analysisResults.spacesCount));
      console.log('Words count:'.padEnd(16, ' ') + chalk.green(analysisResults.wordsCount));
      console.log('═══════════════════');
      console.log();
      console.log();
      console.log('═══════════════════');
      console.log('Words distribution:');
      console.log('═══════════════════');
      Object.entries(analysisResults.wordsHistogram).forEach((entry) => {
        if (entry[1] > WORDS_HISTOGRAM_MINIMUM) {
          console.log(entry[0], chalk.green(entry[1]));
        }
      });
      console.log();
      console.log();
    } else {
      throw Error();
    }
  }
}

if (process.argv.length !== 3) {
  console.clear();
  console.log();
  console.log();
  console.log(chalk.red('The script is not receiving the expected arguments'));
  console.log();
  console.log(chalk.blue('USAGE: ') + chalk.green('yarn start ') + chalk.yellow('<file_path>'));
  console.log(chalk.yellow('<file_path> ') + 'can be a local file path or remote, using http or https protocols');
  console.log();
  console.log();
  exit(1);
}

const dataExtractor = new DataExtractor(process.argv[2]);
dataExtractor.generateDataReport().catch(() => {
  console.clear();
  console.log();
  console.log();
  console.log(chalk.red('Error reading the file provided'));
  console.log();
  console.log();
});
