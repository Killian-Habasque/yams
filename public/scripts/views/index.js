console.log(`
   :=+.                                                  
 -%%%%-                                                  
=%%%%%-                                                  
#%%%%%-                                                  
#%%%%%-                                                  
#%%%%%-                                                  
#%%%%%-       =***=                                      
#%%%%%-     .%%%%%%%.                                    
#%%%%%-     -%%%%%%%:                                    
#%%%%%-      -#%%%#-                                     
#%%%%%-                                                  
#%%%%%-                                                  
#%%%%%-=#%%%%*=                                          
#%%%%%-:*%%%%%%%+.                                       
#%%%%%-  :*%%%%%%%+.                                     
#%%%%%:    :#%%%%%%%+                                    
#%%%%#       :#%%%%%%%+                                  
#%%%+          :*%%%%%%%-                                
--:              .-===-.     

`);
console.log(`
%c© Killian Habasque - %cwww.killian-habasque.fr

`, 'color: #FF5722', 'color: #2196F3');


import { loadHome } from './home.js';
import { loadHeader } from './header.js';
import { loadData } from '../data/index.js';


// document.addEventListener('DOMContentLoaded', async function () {
let placeholders = document.querySelectorAll('.content-placeholder');

await Promise.all(
    Array.from(placeholders).map(placeholder => {
        let url = placeholder.getAttribute('data-url');
        return loadFile(url).then(text => {
            placeholder.innerHTML = text;
        });
    })
);

initializeDependentScripts();
// });

function loadFile(filename) {
    return fetch(filename)
        .then(response => response.text())
        .catch(error => console.error('Error loading file:', error));
}

function initializeDependentScripts() {
    loadHome()
    loadHeader()
    loadData()
}
