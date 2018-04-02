'use strict';

window.onload = main(); // runs main() function when all page has downloaded
//FetchJSON function
function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                cb(null, xhr.response); // here return response of request (NO ERROR)
            } else {
                cb(new Error(xhr.statusText)); // here return error message ( there is an ERROR)
            }
        }
    };
    xhr.send();
}

//Function to create and append DOM child
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


    fetchJSON(url, function (error, data) {
        if (error !== null) {
            error.log("There is Error, Try Again!");
        } else {
            renderSelect(data); //data is xhr.response which is array of objects 

        }
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

    fetchJSON(data, function (error, repo) {
        if (error !== null) {
            error.log("error");
        } else {
            createAndAppend('li', ul, {
                html: 'Name : ' + "<a href=" + repo.html_url + ' target="_blank" >' + repo.name + "</a>",
            });
            createAndAppend('li', ul, {
                html: 'Description : ' + repo.description
            });
            createAndAppend('li', ul, {
                html: 'Forks : ' + repo.forks
            });
            createAndAppend('li', ul, {
                html: 'Updated : ' + repo.updated_at
            });

        }
    });


}

// function to fetch contr info
function contrInfo(data) {

    const rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = '';

    fetchJSON(data, (error, rep) => {

        if (error !== null) {

            error.log("error");

        } else {

            const contrUrl = rep.contributors_url;

            fetchJSON(contrUrl, (error, contributor) => {

                if (error !== null) {

                    error.log("error");

                } else {

                    const ul = createAndAppend('ul', rightContainer, {
                        id: 'ulRightContr'
                    });

                    for (const k in contributor) {

                        const li = createAndAppend('li', ul);

                        createAndAppend('img', li, {
                            src: contributor[k].avatar_url,
                            alt: "user's image"
                        });

                        createAndAppend('div', li, {
                            html: contributor[k].login
                        });

                        createAndAppend('div', li, {
                            html: contributor[k].contributions

                        });

                    }

                }
            });
        }
    });
}
