function char_check(textbox){
    document.getElementById('char_count').innerText= `${300 - textbox.value.length} characters remaining`;
}