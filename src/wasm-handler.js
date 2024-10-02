const fs = require('fs').promises;
const path = require('path');

async function loadWasm() {
  try {
    const wasmPath = path.resolve(__dirname, 'cowsay.wasm');
    console.log(`[WASM] Loading WASM file from: ${wasmPath}`);
    
    const wasmBuffer = await fs.readFile(wasmPath);
    console.log('[WASM] WASM file loaded successfully');

    const wasmModule = await WebAssembly.compile(wasmBuffer);
    console.log('[WASM] WASM module compiled');

    const instance = await WebAssembly.instantiate(wasmModule, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        abort: () => console.log('Abort called from WASM'),
      }
    });
    console.log('[WASM] WASM module instantiated');

    return instance.exports;
  } catch (error) {
    console.error('[WASM] Failed to load WASM module:', error);
    throw error;
  }
}

async function runCowsay(message) {
  try {
    console.log(`[WASM] Running cowsay with message: "${message}"`);
    const wasmExports = await loadWasm();
    
    if (typeof wasmExports.cowsay !== 'function') {
      throw new Error('cowsay function not found in WASM module');
    }

    // Supposons que la fonction cowsay prend un pointeur et une longueur
    const encoder = new TextEncoder();
    const messageUint8 = encoder.encode(message);
    const messagePtr = wasmExports.alloc(messageUint8.length);
    new Uint8Array(wasmExports.memory.buffer, messagePtr, messageUint8.length).set(messageUint8);

    const resultPtr = wasmExports.cowsay(messagePtr, messageUint8.length);
    const resultView = new Uint8Array(wasmExports.memory.buffer);
    let endPtr = resultPtr;
    while (resultView[endPtr] !== 0) endPtr++;
    const resultArray = resultView.slice(resultPtr, endPtr);
    const result = new TextDecoder().decode(resultArray);

    console.log(`[WASM] Cowsay result: "${result}"`);
    return result;
  } catch (error) {
    console.error('[WASM] Error in runCowsay:', error);
    throw error;
  }
}

module.exports = { runCowsay };
