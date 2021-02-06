function initTermynals (){
    document.querySelectorAll('[id^="termynal"]').forEach(
        terminal=>{
            new Termynal(terminal);
        }
    );
}

initTermynals();
