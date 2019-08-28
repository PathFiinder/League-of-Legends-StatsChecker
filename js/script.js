document.addEventListener('DOMContentLoaded', function () {

    const apiKey = 'RGAPI-d681167a-3df4-47bb-8cb4-0278f71c2799';

    const btn = document.querySelector('.main__button');
    const mainInfo = document.querySelector('.main__info');
    const inputValueNickname = document.querySelector('.form__input');
    const infoAccStats = document.querySelector('.info__accStats');
    const infoMasteryStats = document.querySelector('.info__masteryStats');
    const historyGames = document.querySelector('.info__historyGames');


    const championsNameById = [];
    const historyGamesInfo = [];
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


                    /*console.log(mainInfo)
                    if (mainInfo != null) {
                        var child = mainInfo.lastElementChild;
                        while (child) {
                            mainInfo.removeChild(child);
                            child = mainInfo.lastElementChild;
                        }

                    }
                    console.log(mainInfo)*/


                    if (json != null) {
                        infoAccStats.innerHTML = `
                                <img src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/profileicon/${json.profileIconId}.png" alt="Profil Icon" class="info__profilIcon">
                                <h2 class="info__nickname">${json.name}</h2>
                                <div class="info__level-container">
                                    <h3 class="info__summLevel">${json.summonerLevel}</h3>
                                </div>`
                        mainInfo.classList.add('main__info--active');
                        infoAccStats.classList.add('info__accStats--active');

                        getRank(json.id);
                        getChampions();
                        getMastery(json.id);
                        getHistoryGames(json.accountId)
                    }
                })
                .catch(err => console.log("Error:" + err))
        } else {
            console.log("Insert nickname")
        }
    }



    getRank = (id) => {
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


                    let ttfRankedTier = "UNRANKED",
                        ttfRankedDiv = "",
                        ttfRankedPoinst = 0,
                        ttfRankedWins = 0,
                        ttfRankedLosses = 0;
                    let flexRankedTier = "UNRANKED",
                        flexRankedDiv = "",
                        flexRankedPoinst = 0,
                        flexRankedWins = 0,
                        flexRankedLosses = 0;
                    let SoloDuoRankedTier = "UNRANKED",
                        SoloDuoRankedDiv = "",
                        SoloDuoRankedPoinst = 0,
                        SoloDuoRankedWins = 0,
                        SoloDuoRankedLosses = 0;


                    [].forEach.call(json, (ele, index) => {
                        if (ele.queueType == "RANKED_SOLO_5x5") {
                            SoloDuoRankedTier = json[index].tier;
                            SoloDuoRankedDiv = json[index].rank;
                            SoloDuoRankedPoinst = json[index].leaguePoints;
                            SoloDuoRankedWins = json[index].wins;
                            SoloDuoRankedLosses = json[index].losses;
                        } else if (ele.queueType == "RANKED_FLEX_SR") {
                            flexRankedTier = json[index].tier;
                            flexRankedDiv = json[index].rank;
                            flexRankedPoinst = json[index].leaguePoints;
                            flexRankedWins = json[index].wins;
                            flexRankedLosses = json[index].losses;
                        } else if (ele.queueType == "RANKED_TFT") {
                            ttfRankedTier = json[index].tier;
                            ttfRankedDiv = json[index].rank;
                            ttfRankedPoinst = json[index].leaguePoints;
                            ttfRankedWins = json[index].wins;
                            ttfRankedLosses = json[index].losses;
                        }
                    })

                    document.querySelector('.info__rankedStats').innerHTML = `
                            <div class="ranked__single-item" data-ranked="solo/duo">
                                <h2 class="ranked__title">Ranked Solo/Duo</h2>
                                <img class="ranked__tier-image" alt="Tier ${SoloDuoRankedTier} image" src="images/emblems/Emblem_${SoloDuoRankedTier}.png">
                                <h3 class="ranked__tier"> ${SoloDuoRankedTier} ${SoloDuoRankedDiv}</h3>
                                <h3 class="ranked__stats"><span class="ranked__stats--bold">${SoloDuoRankedPoinst} LP</span> / ${SoloDuoRankedWins}W  / ${SoloDuoRankedLosses}L</h3>
                                <h3 class="ranked__win-ratio"> Win ratio:  ${(SoloDuoRankedWins != 0)?((SoloDuoRankedWins/(SoloDuoRankedWins + SoloDuoRankedLosses)) * 100).toFixed(0) : 0}%</h3>
                            </div>
                            <div class="ranked__single-item" data-ranked="flex">
                                <h2 class="ranked__title">Ranked Flex 5x5 </h2>
                                <img class="ranked__tier-image" alt="Tier ${flexRankedTier} image" src="images/emblems/Emblem_${flexRankedTier}.png">
                                <h3 class="ranked__tier"> ${flexRankedTier} ${flexRankedDiv}</h3>
                                <h3 class="ranked__stats"><span class="ranked__stats--bold">${flexRankedPoinst} LP</span> / ${flexRankedWins}W  / ${flexRankedLosses}L</h3>
                                <h3 class="ranked__win-ratio"> Win ratio:  ${(flexRankedWins != 0)?((flexRankedWins/(flexRankedWins + flexRankedLosses)) * 100).toFixed(0) : 0}%</h3>
                            </div>
                            <div class="ranked__single-item" data-ranked="ttf">
                                <h2 class="ranked__title">Ranked TTF</h2>
                                <img class="ranked__tier-image" alt="Tier ${ttfRankedTier} image" src="images/emblems/Emblem_${ttfRankedTier}.png">
                                <h3 class="ranked__tier"> ${ttfRankedTier} ${ttfRankedDiv}</h3>
                                <h3 class="ranked__stats"><span class="ranked__stats--bold">${ttfRankedPoinst} LP</span> / ${ttfRankedWins}W  / ${ttfRankedLosses}L</h3>
                                <h3 class="ranked__win-ratio"> Win ratio:  ${(ttfRankedWins != 0)?((ttfRankedWins/(ttfRankedWins + ttfRankedLosses)) * 100).toFixed(0) : 0}%</h3>
                            </div>       
                    `

                    const unrankedColorBorder = "white"
                    const ironColorBorder = '#434b4d';
                    const silverColorBorder = '#9ca0a1';
                    const goldColorBorder = 'gold';
                    const platinumColorBorder = '#44AB44';
                    const diamondColorBorder = '#b9f2ff';
                    const masterColorBorder = '#740BFD';
                    const grandmasterColorBorder = '#7A0707';
                    const challengerColorBorder = '#CBD111';



                    infoAccStats.style.borderColor = eval(SoloDuoRankedTier.toLowerCase() + 'ColorBorder');





                    /*[].forEach.call(json.matches, (ele) => {
                        console.log(ele.queue)
                    })*/
                }
            })
            .catch(err => console.log("error     " + err))
    }

    getChampions = () => {
        fetch('http://ddragon.leagueoflegends.com/cdn/9.17.1/data/en_US/champion.json')
            .then((data) => {
                return data.json();
            })
            .then((json) => {
                [].forEach.call(Object.values(json.data), (ele, index) => {
                    championsNameById.push({
                        name: ele.id,
                        key: parseInt(ele.key, 10),
                    })
                });
            })
            .catch((error) => console.log(error))
    }

    getMastery = (id) => {
        fetch(`https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${apiKey}`)
            .then((data) => {
                return data.json()
            })
            .then((mastery) => {
                const firstMainChampion = mastery[0];
                const secondMainChampion = mastery[1];
                const thirdMainChampion = mastery[2];
                const fourthMainChampion = mastery[3];

                let firstMainChampionName = "";
                let secondMainChampionName = "";
                let thirdMainChampionName = "";
                let fourthMainChampionName = "";

                championsNameById.forEach((Element) => {
                    if (Element.key == firstMainChampion.championId) {
                        firstMainChampionName = Element.name
                    } else if (Element.key == secondMainChampion.championId) {
                        secondMainChampionName = Element.name
                    } else if (Element.key == thirdMainChampion.championId) {
                        thirdMainChampionName = Element.name
                    } else if (Element.key == fourthMainChampion.championId) {
                        fourthMainChampionName = Element.name
                    }
                })




                infoMasteryStats.innerHTML = `
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${firstMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${firstMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${firstMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${secondMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${secondMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${secondMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${thirdMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${thirdMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${thirdMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${fourthMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${fourthMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${fourthMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                `
                infoMasteryStats.classList.add('info__masteryStats--active')

            })
    }

    getHistoryGames = (id) => {
        fetch(`https://eun1.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?api_key=${apiKey}`)
            .then((data) => {
                return data.json();
            })
            .then((json) => {
                [].forEach.call(json.matches, (element, index) => {
                    if (index >= 0 && index <= 9) {
                        historyGamesInfo.push(element);
                    }
                });

                historyGamesInfo.forEach((element) => {
                    getSingleGameHistory(element.gameId)
                });
                //getSingleGameHistory(historyGamesInfo[0].gameId)

            })
            .catch((error) => console.log(error))
    }

    getSingleGameHistory = (matchID) => {
        fetch(`https://eun1.api.riotgames.com/lol/match/v4/matches/${matchID}?api_key=${apiKey}`)
            .then((data) => {
                return data.json()
            })
            .then((json) => {
                //console.log(json);

                let idTab = "";
                let win = false;
                let statsKill = 0;
                let statsDeaths = 0;
                let statsAssists = 0;
                let championId = 0;
                let championName = "";

                [].forEach.call(json.participantIdentities, (element) => {
                    if (element.player.summonerName == inputValueNickname.value) {
                        idTab = element.participantId;
                    }
                });

                [].forEach.call(json.participants, (element) => {

                    if (element.participantId == idTab) {
                        //console.log(element)
                        win = element.stats.win;
                        statsKill = element.stats.kills;
                        statsDeaths = element.stats.deaths;
                        statsAssists = element.stats.assists;
                        championId = element.championId;

                    }
                })

                championsNameById.forEach(element => {
                    if (element.key == championId) {
                        championName = element.name
                    }
                })

                historyGames.innerHTML += `
                    <div class="historyGame__single">
                        <h2 class="historyGames__type-of-game">${json.gameMode}</h2>
                        <img class="historyGames__player-champion-image" alt="Champion player image: ${championName}" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${championName}.png"> 
                        <h3 class="historyGames__result">${win}</h3>
                        <h3 class="historyGames__stats">${statsKill} / ${statsDeaths} / ${statsAssists}</h3>
                    </div>
                `

                historyGames.classList.add('info__historyGames--active');
            })
    }


    btn.addEventListener('click', (event) => {
        event.preventDefault();


        main(inputValueNickname.value);


        //inputValueNickname.value = "";
    });
})