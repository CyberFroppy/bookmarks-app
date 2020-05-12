const APIKEY = "2abbf7c3-245b-404f-9473-ade729ed4653";
const bookmarksList = document.querySelector('.results');

let list = [];
function fetchBookmarks() {
    let url = '/bookmarks';
    let settings = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${APIKEY}`
        }
    };
    fetch(url, settings).then(response => {
        console.log(response)
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
        .then(displayBookmark)
        .catch(err => {
            // results.innerHTML = `<div>${err.message}</div>`
            console.log(err.message);
        })

}

function displayBookmark(responseJSON) {
    bookmarksList.innerHTML = '';
    list = responseJSON;
    console.log(list);
    for (let i = 0; i < list.length; i++) {
        bookmarksList.innerHTML += `
        <div class = "bookmark">
            <li>Id: ${list[i].id}</li>
            <li>Title: ${list[i].title}</li>
            <li>Description: ${list[i].description}</li>
            <li>Url: ${list[i].url}</li>
            <li>Rating: ${list[i].rating}</li>
        </div>
        `
    }
}
function searchTitle() {
    let title = document.querySelector('#title-search');
    let url = `/bookmark?title=${title.value}`;
    let searchError = document.querySelector('.search-error');
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${APIKEY}`
        }
    };
    fetch(url, settings).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
        .then(displayBookmark)
        .catch(err => {
            searchError.innerHTML = `<div>${err.message}</div>`
            console.log(err.message);
        })

}
function searchSubmit() {
    let form = document.querySelector('#search-btn');
    form.addEventListener('click', (event) => {
        event.preventDefault();
        searchTitle()
    });
}

function deleteId() {
    let deleteItem = document.querySelector('#delete-id');
    let url = `/bookmark/${deleteItem.value}`;
    let deleteError = document.querySelector('.delete-error');
    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${APIKEY}`
        }
    };
    fetch(url, settings).then(response => {
        if (response.ok && response.status == 200) {
            fetchBookmarks();
        }
        throw new Error(response.statusText);
    })
        .catch(err => {
            deleteError.innerHTML = `<div>${err.message}</div>`
            console.log(err.message);
        })
    deleteItem.value = "";

}
function deleteSubmit() {
    let form = document.querySelector('#delete-btn');
    form.addEventListener('click', (event) => {
        event.preventDefault();
        deleteId();
    });
}

function postBookmark() {
    let title = document.querySelector('#bookmark-title');
    let description = document.querySelector('#bookmark-description');
    let bookmarkUrl = document.querySelector('#bookmark-url');
    let rating = document.querySelector('#bookmark-rating');
    let bookmark = {
        title: title.value,
        description: description.value,
        url: bookmarkUrl.value,
        rating: Number(rating.value)
    }
    let url = `/bookmarks`;
    let postError = document.querySelector('.post-error');
    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${APIKEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookmark)
    };
    fetch(url, settings).then(response => {
        if (response.ok) {
            fetchBookmarks();
        }
        throw new Error(response.statusText);
    })
        .catch(err => {
            postError.innerHTML = `<div>${err.message}</div>`
            console.log(err.message);
        })
    title.value = "";
    description.value = "";
    bookmarkUrl.value = "";
    rating.value = "";

}
function postSubmit() {
    let form = document.querySelector('#post-btn');
    form.addEventListener('click', (event) => {
        event.preventDefault();
        postBookmark();
    });
}

function updateBookmark() {
    let id = document.querySelector('#bookmark-id-u');
    let title = document.querySelector('#bookmark-title-u');
    let description = document.querySelector('#bookmark-description-u');
    let bookmarkUrl = document.querySelector('#bookmark-url-u');
    let rating = document.querySelector('#bookmark-rating-u');

    let bookmark = {
        id: id.value
    }
    if (title.value) { bookmark.title = title.value; }
    if (description.value) { bookmark.description = description.value; }
    if (bookmarkUrl.value) { bookmark.url = bookmarkUrl.value; }
    if (rating) { bookmark.rating = Number(rating.value); }
    let url = `/bookmark/${bookmark.id}`;
    let updateError = document.querySelector('.update-error');
    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${APIKEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookmark)
    };
    fetch(url, settings).then(response => {
        if (response.ok) {
            fetchBookmarks();
        }
        throw new Error(response.statusText);
    })
        .catch(err => {
            updateError.innerHTML = `<div>${err.message}</div>`
            console.log(err.message);
        })
    id.value = "";
    title.value = "";
    description.value = "";
    bookmarkUrl.value = "";
    rating.value = "";

}
function updateSubmit() {
    let form = document.querySelector('#update-btn');
    form.addEventListener('click', (event) => {
        event.preventDefault();
        updateBookmark();
    });
}
function init() {
    searchSubmit();
    fetchBookmarks();
    deleteSubmit();
    postSubmit();
    updateSubmit();
}

init();