function loadJSON(path, success)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } 
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}
function sendJSON(data, url){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

const tooltip = document.getElementsByClassName("tooltip")[0];
const tooltip_back = document.getElementsByClassName("tooltip_back")[0];

const main_table = document.getElementsByClassName("main_table")[0];

tooltip_back.onclick = function() {
    tooltip.classList.remove("_active");
    tooltip_back.classList.remove("_active");
}

loadJSON('api/api_get_daily_lessons',
    function(data) {
        let days = data;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getUTCFullYear();
        console.log(days);
        console.log(dd, mm, yyyy);
        
        num_day = today.getDay();
        let lessons = days[1];
        for (var i = 0; i < lessons.length; i++) {
            console.log(main_table.childNodes);
            main_table.insertAdjacentHTML('beforeend', `<div class="lesson_block">${lessons[i][0]}<div class="add_block"><div class="descr"><b>Преподаватель</b>: ${lessons[i][2]}</div><div class="descr"><b>Домашнее задание</b>: none</div><div class="descr"><b>Отмечает на лекциях</b>: ${lessons[i][3]}</div></div></div>`);
        }
        let lesson_blocks = document.getElementsByClassName("lesson_block");
        for (let i = 0; i < lesson_blocks.length; i++) {
            let add_block = lesson_blocks[i].childNodes[1];
            lesson_blocks[i].onclick = function () {
                let sum_of_heights = 0;
                for (let j = 0; j < add_block.childNodes.length; j++) {
                    let height = add_block.childNodes[j].offsetHeight;
                    if (height != undefined) {
                        sum_of_heights += height;
                    }
                };
                let correct_h = `${30 + sum_of_heights}px`

                if (add_block.style["max-height"] == correct_h) {
                    add_block.style["max-height"] = "0px";
                }
                else {
                    add_block.style["max-height"] = correct_h;
                }
            }
        }

    }
)