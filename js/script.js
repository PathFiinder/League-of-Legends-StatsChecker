document.addEventListener('DOMContentLoaded', function () {


    const btn = document.querySelector('.main__button');
    const mainInfo = document.querySelector('.main__info');
    const inputValueNickname = document.querySelector('.form__input');
    const infoWrapper = document.querySelector('.info__wrapper');
    const apiKey = 'RGAPI-be750fa8-4742-4ad5-b5b4-fc6859d62128'

    const matchesId = [];
    const draftIdQueue = 400;
    const rankedSoloDuoIdQueue = 420;
    const blindDraftIdQueue = 430;
    const flexIdQueue = 440;
    const aramIdQueue = 450;
    const twistedRankedIdQueue = 470;
    const ttfIdQueue = 1100;

    main = (nickname) => {
        if (nickname != null) {
            fetch( /*'https://cors-anywhere.herokuapp.com/*/ `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${apiKey}`)
                .then((data) => {
                    if (data.status == 200) {
                        return data.json();
                    } else {
                        console.log(data.status)
                    }
                })
                .then((json) => {
                    if (json != null) {
                        infoWrapper.innerHTML = `
                                <img src="http://ddragon.leagueoflegends.com/cdn/9.3.1/img/profileicon/${json.profileIconId}.png" alt="Profil Icon" class="info__profilIcon">
                                <h2 class="info__nickname">${json.name}</h2>
                                <div class="info__level-container">
                                    <h3 class="info__summLevel">${json.summonerLevel}</h3>
                                </div>`
                        mainInfo.classList.add('main__info--active');
                        infoWrapper.classList.add('info__wrapper--active');
                        console.log(json)
                        getRank(json.id);







                    }
                })
                .catch(err => console.log("error     " + err))
        } else {
            console.log("Insert nickname")
        }
    }


    getRank = (id) => {
        console.log(id)
        fetch(`https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`)
            .then((data) => {
                if (data.status == 200) {
                    return data.json();
                } else {
                    console.log(data.status)
                }
            })
            .then((json) => {
                if (json != null) {
                    console.log(json)
                    const ttfRankedTier = json[0].tier;
                    const ttfRankedDiv = json[0].rank;
                    const ttfRankedPoinst = json[0].leaguePoints;
                    const ttfRankedWins = json[0].wins;
                    const ttfRankedLosses = json[0].losses;

                    const flexRankedTier = json[1].tier;
                    const flexRankedDiv = json[1].rank;
                    const flexRankedPoinst = json[1].leaguePoints;
                    const flexRankedWins = json[1].wins;
                    const flexRankedLosses = json[1].losses;

                    const SoloDuoRankedTier = json[2].tier;
                    const SoloDuoRankedDiv = json[2].rank;
                    const SoloDuoRankedPoinst = json[2].leaguePoints;
                    const SoloDuoRankedWins = json[2].wins;
                    const SoloDuoRankedLosses = json[2].losses;


                    

                    document.querySelector('.info__rankedStats').innerHTML = `
                            <div class="ranked__single-item" data-ranked="solo/duo">
                                <h2 class="ranked__title">Ranked Solo/Duo</h2>
                                <img class="ranked__tier-image" alt="Tier ${SoloDuoRankedTier} image" src="images/emblems/Emblem_${SoloDuoRankedTier}.png"
                                <h3 class="ranked__tier">Tier: ${SoloDuoRankedTier}</h3>
                                <h3 class="ranked__division">Division: ${SoloDuoRankedDiv}</h3>
                                <h3 class="ranked__points">Points: ${SoloDuoRankedPoinst}</h3>
                                <h3 class="ranked__wins">Number of wins: ${SoloDuoRankedWins}</h3>
                                <h3 class="ranked__looses">Number of looses: ${SoloDuoRankedLosses}</h3>
                                <h3 class="ranked__total-games"> Total amount of games: ${SoloDuoRankedWins + SoloDuoRankedLosses}</h3>
                            </div>
                            <div class="ranked__single-item" data-ranked="flex">
                                <h2 class="ranked__title">Ranked Flex 5x5 </h2>
                                <img class="ranked__tier-image" alt="Tier ${flexRankedTier} image" src="images/emblems/Emblem_${flexRankedTier}.png"
                                <h3 class="ranked__tier">Tier: ${flexRankedTier}</h3>
                                <h3 class="ranked__division">Division:${flexRankedDiv}</h3>
                                <h3 class="ranked__points">Points: ${flexRankedPoinst}</h3>
                                <h3 class="ranked__wins">Number of wins: ${flexRankedWins}</h3>
                                <h3 class="ranked__looses">Number of looses: ${flexRankedLosses}</h3>
                                <h3 class="ranked__total-games"> Total amount of games: ${flexRankedWins + flexRankedLosses}</h3>
                            </div>
                            <div class="ranked__single-item" data-ranked="ttf">
                                <h2 class="ranked__title">Ranked Teamfights Tactics</h2>
                                <img class="ranked__tier-image" alt="Tier ${ttfRankedTier} image" src="images/emblems/Emblem_${ttfRankedTier}.png"
                                <h3 class="ranked__tier">Tier: ${ttfRankedTier}</h3>
                                <h3 class="ranked__division">Division: ${ttfRankedDiv}</h3>
                                <h3 class="ranked__points">Points: ${ttfRankedPoinst}</h3>
                                <h3 class="ranked__wins">Number of wins: ${ttfRankedWins}</h3>
                                <h3 class="ranked__looses">Number of looses: ${ttfRankedLosses}</h3>
                                <h3 class="ranked__total-games"> Total amount of games: ${ttfRankedWins + ttfRankedLosses}</h3>
                            </div>       
                    `






                    /*[].forEach.call(json.matches, (ele) => {
                        console.log(ele.queue)
                    })*/
                }
            })
            .catch(err => console.log("error     " + err))
    }

    /*mastery = (id) => {
        fetch(`https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${json.id}?api_key=RGAPI-7354b08a-efb2-47ec-a787-4c145067d709`)
            .then((data) => {
                return data.json()
            })
            .then((mastery) => {
                console.log(mastery[0])
            })
    }*/



    btn.addEventListener('click', (event) => {
        event.preventDefault();
        main(inputValueNickname.value);




        inputValueNickname.value = "";
    });
})