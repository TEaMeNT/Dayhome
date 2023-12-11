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

function parseDate(str){
    var mdy = str.split("-");
    return new Date(mdy[0], mdy[1] - 1, mdy[2]);
}
function datediff(first, second) {        
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

const tooltip = document.getElementById("tooltip");
const tooltip_back = document.getElementsByClassName("tooltip_back")[0];
const form = document.getElementById("form");

const main_table = document.getElementsByClassName("main_table")[0];
const date_selector = document.getElementsByClassName("date")[0];
const arrow_left = document.getElementsByClassName("arrow")[0];
const arrow_right = document.getElementsByClassName("arrow")[1];

tooltip_back.onclick = function() {
    tooltip.classList.remove("_active");
    tooltip_back.classList.remove("_active");
}

class Day {
    constructor() {
        this.current_day = new Date();
        this.today_date = this.get_str_date(this.current_day);
        this.week = this.get_week(this.today_date);
        this.num_day = this.get_day(this.current_day, this.week);
    }

    get_str_date(today) {
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getUTCFullYear();
        return yyyy.toString() + "-" + mm.toString() + "-" + dd.toString()
    }

    get_week(today_date) {
        return Math.floor(datediff(parseDate("2023-08-28"), parseDate(today_date)) / 7) + 1;
    }

    get_day(today, week) {
        let ffuuuuu = new Date(today);
        ffuuuuu.setDate(ffuuuuu.getDate() - 1);
        this.num_day = ((week % 2 == 0) * 7) + (ffuuuuu.getDay() + 1);
        return this.num_day;
    }

    change_day(delta) {
        this.current_day.setDate(this.current_day.getDate() + delta);
        this.today_date = this.get_str_date(this.current_day);
        this.week = this.get_week(this.today_date);
        this.num_day = this.get_day(this.current_day, this.week);
    }

    get current_str_date() {
        return this.today_date;
    }

    get current_num_day() {
        return this.num_day;
    }
}

function update_height_block (lesson_block) {
    let add_block = lesson_block.childNodes[2];
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

function loadLessons(lessons, day_count) {
    main_table.innerHTML = "";
    date_selector.value = current_date.current_str_date;
    if (lessons != null) {
        for (var i = 0; i < lessons.length; i++) {
            //console.log(main_table.childNodes);
            main_table.insertAdjacentHTML('beforeend', `<div class="lesson_block"><div class="txt">${lessons[i][0]}</div><div class="type"></div><div class="add_block"><div class="descr"><b>Преподаватель</b>: ${lessons[i][2]}</div><div class="descr"><b>Домашнее задание</b>:</div><div class="descr"><b>Можно пропускать: </b>Нет</div></div></div>`);
        }
        let lesson_blocks = document.getElementsByClassName("lesson_block");
        for (let i = 0; i < lesson_blocks.length; i++) {
            if (lessons[i][1]) {
                lesson_blocks[i].childNodes[1].style.backgroundColor = "mediumpurple";
            }
            if (lessons[i][3]) {
                lesson_blocks[i].childNodes[2].childNodes[2].innerHTML = "<b>Можно пропускать: </b>Да";
            }
            let add_block = lesson_blocks[i].childNodes[2];
            let homework = add_block.childNodes[1];
            let skip = add_block.childNodes[2];
            lesson_blocks[i].firstChild.onclick = function () {
                update_height_block(lesson_blocks[i]);
            }
            homework.onclick = function() {
                tooltip.classList.add("_active");
                tooltip_back.classList.add("_active");
                tooltip.childNodes[1].value = homework.textContent.substring(18);
                console.log(homework.textContent.substring(18));
                tooltip.childNodes[3].onclick = function() {
                    var data_to_send = [date_selector.value + " " + i, form.value];
                    sendJSON(JSON.stringify(data_to_send), "/api/homework_upd");
                    homework.innerHTML = "<b>Домашнее задание</b>: " + form.value;
                    tooltip.classList.remove("_active");
                    tooltip_back.classList.remove("_active");
                    update_height_block(lesson_blocks[i]);
                }
            }
            skip.onclick = function() {
                console.log(day_count);
                var data_to_send = [lessons[i][4], !lessons[i][3]];
                if (!lessons[i][3]) {
                    lesson_blocks[i].childNodes[2].childNodes[2].innerHTML = "<b>Можно пропускать: </b>Да";
                }
                else {
                    lesson_blocks[i].childNodes[2].childNodes[2].innerHTML = "<b>Можно пропускать: </b>Нет";
                }
                sendJSON(JSON.stringify(data_to_send), "/api/skip_upd");        
            }
        }
    }
    else {
        main_table.innerHTML = '<div class="no_lessons">Отдыхаем</div>';
    }
}

function loadHomework() {
    let lesson_blocks = document.getElementsByClassName("lesson_block");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/get_day_homework", true);
    xhr.send(JSON.stringify([date_selector.value, lesson_blocks.length]));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
                let lesson_blocks = document.getElementsByClassName("lesson_block");
                for (let i = 0; i < data.length; i++) {
                    lesson_blocks[data[i][0]].childNodes[2].childNodes[1].textContent = "<b>Домашнее задание</b>: " + data[i][1][0][0];
                }
            }
        }
    };
}

loadJSON('api/api_get_daily_lessons',
    function(data) {
        let days = data;
        console.log(days);
        current_date = new Day();

        date_selector.value = current_date.current_str_date;
        var lessons = days[current_date.current_num_day];

        arrow_left.onclick = function() {
            current_date.change_day(-1);
            lessons = days[current_date.current_num_day];
            loadLessons(lessons, current_date.current_num_day);
            loadHomework();
        }
        arrow_right.onclick = function() {
            current_date.change_day(1);
            lessons = days[current_date.current_num_day];
            loadLessons(lessons, current_date.current_num_day);
            loadHomework();
        }
        date_selector.addEventListener('change', function(e) {
            current_date.change_day(datediff(parseDate(current_date.current_str_date), parseDate(this.value)));
            lessons = days[current_date.current_num_day];
            loadLessons(lessons, current_date.current_num_day);
            loadHomework();
        });

        loadLessons(lessons, current_date.current_num_day);
        loadHomework();
    }
)