use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn alloc(len: usize) -> *mut u8 {
    let mut buf = Vec::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr
}

#[wasm_bindgen]
pub fn cowsay(ptr: *mut u8, len: usize) -> *mut u8 {
    let message = unsafe { String::from_raw_parts(ptr, len, len) };
    let cow = format!(" {}\n< {} >\n {}\n", "-".repeat(message.len() + 2), message, "-".repeat(message.len() + 2));
    let cow = format!("{}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||", cow);
    
    let output = cow.into_bytes();
    let ptr = output.as_ptr() as *mut u8;
    std::mem::forget(output);
    ptr
}
