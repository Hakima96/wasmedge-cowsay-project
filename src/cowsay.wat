(module
  (import "env" "__wbindgen_malloc" (func $__wbindgen_malloc (param i32) (result i32)))
  
  (func $cowsay (param $messagePtr i32) (result i32)
    (local $resultPtr i32)
    
    ;; Allouer de la mémoire pour le résultat
    i32.const 128 ;; Taille de la mémoire à allouer
    call $__wbindgen_malloc
    local.set $resultPtr
    
    ;; Effectuer les opérations nécessaires avec $resultPtr ici
    
    ;; Retourner le pointeur du résultat
    local.get $resultPtr
  )
  
  (memory (export "memory") 1)
  (export "cowsay" (func $cowsay))
)

