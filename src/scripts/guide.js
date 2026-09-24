function handleTransition(event) {
    const element = event.target;
    const targetId = element.getAttribute('name');
    const targetElement = document.getElementById(targetId);    

    if (targetElement) {
        // Hide all other paragraphs
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach((p) => {
            if (p !== targetElement) {
                p.style.height = '0';
                p.style.visibility = 'hidden';
            }
        });

        if(targetElement.style.visibility === 'hidden'){
            // Show the target paragraph
            targetElement.style.height = 'auto';
            targetElement.style.visibility = 'visible';
        } else {
            // Hide the target paragraph
            targetElement.style.height = '0';
            targetElement.style.visibility = 'hidden';
        }
    }
}