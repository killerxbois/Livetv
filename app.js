let channels = [];
const api_url = 'https://sheetdb.io/api/v1/5pgfrwklxip2x';

fetch(api_url)
    .then(res => res.json())
    .then(data => {
        channels = data;
        loadCategories();
        loadContinueWatching();
        loadFavorites();
        displayChannels(channels);
    });

function loadCategories() {
    const categories = [...new Set(channels.map(c => c.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

function displayChannels(list) {
    const listContainer = document.getElementById('channelList');
    listContainer.innerHTML = '';
    list.forEach(channel => {
        const div = document.createElement('div');
        div.className = 'channel';
        div.innerHTML = `
            <img src="${channel.thumbnail}" alt="${channel.title}">
            <p>${channel.title}</p>
        `;
        div.onclick = () => {
            playChannel(channel.stream);
            saveContinue(channel);
        };
        div.oncontextmenu = (e) => {
            e.preventDefault();
            saveFavorite(channel);
        };
        listContainer.appendChild(div);
    });
}

function playChannel(url) {
    const player = videojs('videoPlayer');
    player.src({ type: 'application/x-mpegURL', src: url });
    player.play();
    document.getElementById('playerContainer').style.display = 'block';
    window.scrollTo(0, 0);
}

function filterChannels() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const filtered = channels.filter(channel =>
        channel.title.toLowerCase().includes(keyword) &&
        (category === '' || channel.category === category)
    );
    displayChannels(filtered);
}

// Favorites
function saveFavorite(channel) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favs.find(c => c.title === channel.title)) {
        favs.push(channel);
        localStorage.setItem('favorites', JSON.stringify(favs));
        loadFavorites();
        alert('Added to favorites!');
    }
}

function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const listContainer = document.getElementById('favoritesList');
    listContainer.innerHTML = '';
    favs.forEach(channel => {
        const div = document.createElement('div');
        div.className = 'channel';
        div.innerHTML = `
            <img src="${channel.thumbnail}" alt="${channel.title}">
            <p>${channel.title}</p>
        `;
        div.onclick = () => playChannel(channel.stream);
        listContainer.appendChild(div);
    });
}

// Continue Watching
function saveContinue(channel) {
    localStorage.setItem('continue', JSON.stringify(channel));
    loadContinueWatching();
}

function loadContinueWatching() {
    const cont = JSON.parse(localStorage.getItem('continue') || 'null');
    const listContainer = document.getElementById('continueList');
    listContainer.innerHTML = '';
    if (cont) {
        const div = document.createElement('div');
        div.className = 'channel';
        div.innerHTML = `
            <img src="${cont.thumbnail}" alt="${cont.title}">
            <p>${cont.title}</p>
        `;
        div.onclick = () => playChannel(cont.stream);
        listContainer.appendChild(div);
    }
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
}
// Splash Screen remover
window.onload = () => {
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
    }, 2000); // splash will hide after 2 seconds
}