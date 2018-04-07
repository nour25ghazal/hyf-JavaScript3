'use strict';

window.onload = main();

function fetchJSON(url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    resolve(xhr.response); // here return response of request (NO ERROR)
                } else {
                    reject(new Error(xhr.statusText)); // here return error message ( there is an ERROR)
                }
            }
        };
        xhr.send();
    });
}

function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
        const value = options[key];
        if (key === 'html') {
            elem.innerHTML = value;
        } else {
            elem.setAttribute(key, value);
        }
    });
    return elem;
}

function main() {
    const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    const root = document.getElementById('root');

    createAndAppend('h1', root, {
        html: 'HYF API'
    });

    const header = createAndAppend('div', root, {
        id: 'header'
    });

    createAndAppend('label', header, {
        html: 'Select a Repository: '

    });

    createAndAppend('select', header, {
        id: 'select',
        html: '<option>Repositories</option> '
    });
    const containers = createAndAppend('div', root, {
        id: 'containers'
    });

    const leftContainer = createAndAppend('div', containers, {
        html: 'REPO INFO: ',
        id: 'leftContainer'
    });
    const rightContainer = createAndAppend('div', containers, {
        html: 'CONTR INFO: ',
        id: 'rightContainer'
    });



    fetchJSON(url)
        .then(data => {
            renderSelect(data);
        })
        .catch(error => {
            console.log(error.message);
        });
}

function renderSelect(data) {
    const select = document.getElementById('select');

    for (let i = 0; i < data.length; i++) {
        createAndAppend('option', select, {
            html: data[i].name,
            value: data[i].url
        });
    }

    select.addEventListener('change', function (e) {
        repoInfo(e.target.value);
        contrInfo(e.target.value);

    })

}

//  function to fetch repo info
function repoInfo(data) {
    const leftContainer = document.getElementById('leftContainer');
    leftContainer.innerHTML = '';

    const ul = createAndAppend('ul', leftContainer, {
        id: 'ulLeftContr'
    });

    fetchJSON(data)
        .then(data => {
            createAndAppend('li', ul, {
                html: 'Name : ' + "<a href=" + data.html_url + ' target="_blank" >' + data.name + "</a>",
            });
            createAndAppend('li', ul, {
                html: 'Description : ' + data.description
            });
            createAndAppend('li', ul, {
                html: 'Forks : ' + data.forks
            });
            createAndAppend('li', ul, {
                html: 'Updated : ' + data.updated_at
            });
        })
        .catch(error => {
            console.log(error.message);
        });
}







// function to fetch contr info
function contrInfo(data) {
    const rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = '';
    fetchJSON(data)
        .then(data => {
            const contrUrl = data.contributors_url;

            fetchJSON(contrUrl)
                .then(contrUrl => {
                    const ul = createAndAppend('ul', rightContainer, {
                        id: 'ulRightContr'
                    });

                    for (const k in contrUrl) {

                        const li = createAndAppend('li', ul);

                        createAndAppend('img', li, {
                            src: contrUrl[k].avatar_url,
                            alt: "user's image"
                        });

                        createAndAppend('div', li, {

                            html: "<a href=" + contrUrl[k].html_url + ' target="_blank" >' + contrUrl[k].login + "</a>"
                        });

                        createAndAppend('div', li, {
                            html: contrUrl[k].contributions

                        });
                    };
                })
        })

        .catch(error => {
            console.log(error.message);
        });

}