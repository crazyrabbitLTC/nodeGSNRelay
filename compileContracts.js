const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

//Deployment Code from: https://levelup.gitconnected.com/compiling-ethereum-smart-contracts-locally-0-5-2-0-5-x-ebfea0aed3a9

/**
 * Makes sure that the build folder is deleted, before every compilation
 * @returns {*} - Path where the compiled sources should be saved.
 */
function compilingPreperations() {
  const buildPath = path.resolve(__dirname, "build");
  fs.removeSync(buildPath);
  return buildPath;
}

/**
 * Returns and Object describing what to compile and what need to be returned.
 */
function createConfiguration() {
  return {
    language: "Solidity",
    sources: {
      "RelayHub.sol": {
        content: fs.readFileSync(
          path.resolve(
            __dirname,
            "node_modules/tabookey-gasless/contracts",
            "RelayHub.sol"
          ),
          "utf8"
        )
      } /*
            'AnotherFileWithAnContractToCompile.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'AnotherFileWithAnContractToCompile.sol'), 'utf8')
            }*/
    },
    settings: {
      outputSelection: {
        "*": {
          "": [
            "legacyAST",
            "ast"
          ],
          "*": [
            "abi",
            "evm.bytecode.object",
            "evm.bytecode.sourceMap",
            "evm.deployedBytecode.object",
            "evm.deployedBytecode.sourceMap",
            "evm.gasEstimates"
          ]
        },
    }
    }
  };
}

//Previous output Selection
// outputSelection: {
//   // return everything
//   "*": {
//     "*": ["*"]
//   }
// }

/**
 * Searches for dependencies in the Solidity files (import statements). All import Solidity files
 * need to be declared here.
 * @param dependency
 * @returns {*}
 */

function getImports(dependency) {
  console.log("Searching for dependency: ", dependency);
  switch (dependency) {
    case "RelayHubApi.sol":
      return {
        contents: fs.readFileSync(
          path.resolve(
            __dirname,
            "node_modules/tabookey-gasless/contracts",
            "RelayHubApi.sol"
          ),
          "utf8"
        )
      };
    case "RelayRecipient.sol":
      return {
        contents: fs.readFileSync(
          path.resolve(
            __dirname,
            "node_modules/tabookey-gasless/contracts",
            "RelayRecipient.sol"
          ),
          "utf8"
        )
      };
    case "RLPReader.sol":
      return {
        contents: fs.readFileSync(
          path.resolve(
            __dirname,
            "node_modules/tabookey-gasless/contracts",
            "RLPReader.sol"
          ),
          "utf8"
        )
      };
      case "RelayRecipientApi.sol":
      return {
        contents: fs.readFileSync(
          path.resolve(
            __dirname,
            "node_modules/tabookey-gasless/contracts",
            "RelayRecipientApi.sol"
          ),
          "utf8"
        )
      };

    /*case 'AnotherImportedSolidityFile.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'AnotherImportedSolidityFile.sol'), 'utf8')};*/
    default:
      return { error: "File not found" };
  }
}

/**
 * Compiles the sources, defined in the config object with solc-js.
 * @param config - Configuration object.
 * @returns {any} - Object with compiled sources and errors object.
 */
function compileSources(config) {
  try {
    return JSON.parse(solc.compile(JSON.stringify(config), getImports));
  } catch (e) {
    console.log(e);
  }
}

/**
 * Shows when there were errors during compilation.
 * @param compiledSources
 */
function errorHandling(compiledSources) {
  if (!compiledSources) {
    console.error(
      ">>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n",
      "NO OUTPUT"
    );
  } else if (compiledSources.errors) {
    // something went wrong.
    console.error(">>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n");
    compiledSources.errors.map(error => console.log(error.formattedMessage));
  }
}

/**
 * Writes the contracts from the compiled sources into JSON files, which you will later be able to
 * use in combination with web3.
 * @param compiled - Object containing the compiled contracts.
 * @param buildPath - Path of the build folder.
 */
function writeOutput(compiled, buildPath) {
  fs.ensureDirSync(buildPath);

  for (let contractFileName in compiled.contracts) {
    const contractName = contractFileName.replace(".sol", "");
    console.log("Writing: ", contractName + ".json");
    fs.outputJsonSync(
      path.resolve(buildPath, contractName + ".json"),
      compiled.contracts[contractFileName][contractName]
    );
  }
}

const buildPath = compilingPreperations();
const config = createConfiguration();
const compiled = compileSources(config);
errorHandling(compiled);
writeOutput(compiled, buildPath);

//1 - AutoRun Ganache

//2 - Compile Contracts
//Compile Relay Hub Contract
//Compule userContract

//3 - Deploy Contracts
//Deploy Relay hub Contract
//Deploy userContract

//4 - Init RelayHub and init userContract
//Fund RelayHub
//Fund userContract
