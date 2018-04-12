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
                     reject(new Error(`Network error: ${xhr.statusText} - ${xhr.status}`)); // here return error message ( there is an ERROR)
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
            const container = document.getElementById('containers');
            container.innerHTML = error.message;
        });
}

function renderSelect(data) {
    const select = document.getElementById('select');

    for (const repo of data) {
        createAndAppend('option', select, {
            html: repo.name,
            value: repo.url
        });
    }

    select.addEventListener('change', function (e) {
        contributorsInfo(e.target.value);
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
function contributorsInfo(data) {
    const rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = '';
    return fetchJSON(data)
        .then(data => {
            const contrUrl = data.contributors_url;

            fetchJSON(contrUrl)
                .then(contrUrl => {
                    const ul = createAndAppend('ul', rightContainer, {
                        id: 'ulRightContr'
                    });

                    for (const contrs of contrUrl) {

                        const li = createAndAppend('li', ul);

                        createAndAppend('img', li, {
                            src: contrs.avatar_url,
                            alt: "user's image"
                        });

                        createAndAppend('div', li, {

                            html: "<a href=" + contrs.html_url + ' target="_blank" >' + contrs.login + "</a>"
                        });

                        createAndAppend('div', li, {
                            html: contrs.contributions

                        });
                    };
                })
        })

        .catch(error => {
            console.log(error.message);
        });

}
