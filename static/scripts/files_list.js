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

loadJSON('/api/get_files_list',
    function(data) {
        files_list = data;
        for (var i = 0; i < files_list.length; i++) {
            var files_block = `<div class="files_block">
                                <div class="name">${files_list[i][0]}</div>
                                <div class="files">`;
            for (var j = 1; j < files_list[i].length; j++) {
                files_block += `<a href="/static/files/${files_list[i][0]}/${files_list[i][j]}" class="down" download>
                                    <div class="exit_img" style="background-image: url('../static/imgs/files.png');"></div>
                                    ${files_list[i][j]}
                                </a>`;
            }
            files_block += `    </div>
                            </div>`;
            document.getElementsByClassName("container")[0].innerHTML += files_block;
        }
    }
);