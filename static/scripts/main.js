let lesson_blocks = document.getElementsByClassName("lesson_block");
for (let i = 0; i < lesson_blocks.length; i++) {
    lesson_blocks[i].onclick = function () {
        let home_h = lesson_blocks[i].childNodes[3].offsetHeight;
        let correct_h = `${204 + home_h}px`

        if (lesson_blocks[i].style["max-height"] == correct_h) {
            lesson_blocks[i].style["max-height"] = "60px";
        }
        else {
            lesson_blocks[i].style["max-height"] = correct_h;
        }
    }
}

const tooltip = document.getElementsByClassName("tooltip")[0];
const tooltip_back = document.getElementsByClassName("tooltip_back")[0];

tooltip_back.onclick = function() {
    tooltip.classList.remove("_active");
    tooltip_back.classList.remove("_active");
}