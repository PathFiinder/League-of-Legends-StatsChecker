const btn = document.querySelector('.button');


show = () => {
    console.log("show")
    fetch( /*'https://cors-anywhere.herokuapp.com/*/ 'https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TheWanh3da?api_key=RGAPI-7354b08a-efb2-47ec-a787-4c145067d709')
        .then((data) => {
            //console.log("ok");
            //console.log(data)
            return data.json();
        })
        .then((json) => {
            document.querySelector('.nickname').textContent = json.name;
            document.querySelector('.lvl').textContent = json.summonerLevel
        })
        .catch(err => console.log("error" + err))
}


btn.addEventListener('click', show);