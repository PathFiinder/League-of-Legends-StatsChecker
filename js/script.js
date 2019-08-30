document.addEventListener('DOMContentLoaded', function () {

    const apiKey = 'RGAPI-fb1a756d-3392-4fa7-89de-2be2e808c217';

    const btn = document.querySelector('.statsChecker__button');
    const mainInfo = document.querySelector('.statsChecker__info');
    const inputValueNickname = document.querySelector('.form__input');
    const infoAccStats = document.querySelector('.info__accStats');
    const infoMasteryStats = document.querySelector('.info__masteryStats');
    const historyGames = document.querySelector('.info__historyGames');

    const spellsIdWithName = [{
        name: "Barrier",
        id: 21
    }, {
        name: "Clarity",
        id: 13
    }, {
        name: "Cleanse",
        id: 1
    }, {
        name: "Exhaust",
        id: 3
    }, {
        name: "Flash",
        id: 4
    }, {
        name: "Ghost",
        id: 6
    }, {
        name: "Heal",
        id: 7
    }, {
        name: "Ignite",
        id: 14
    }, {
        name: "Smite",
        id: 11
    }, {
        name: "Teleport",
        id: 12
    }, {
        name: "Snowball",
        id: 32
    }, {
        name: "PoroToss",
        id: 31
    }, {
        name: "PoroRecall",
        id: 30
    }]
    const championsNameById = [];
    const historyGamesInfo = [];
    const draftIdQueue = 400;
    const rankedSoloDuoIdQueue = 420;
    const blindDraftIdQueue = 430;
    const flexIdQueue = 440;
    const aramIdQueue = 450;
    const twistedRankedIdQueue = 470;
    const ttfIdQueue = 1100;
    const botsIdQueue = 850;





    main = (nickname) => {
        if (nickname != null) {

            fetch( /*`https://cors-anywhere.herokuapp.com/*/ `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${apiKey}`)
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
                                <img src="https://ddragon.leagueoflegends.com/cdn/9.17.1/img/profileicon/${json.profileIconId}.png" alt="Profil Icon" class="info__profilIcon">
                                <h2 class="info__nickname">${json.name}</h2>
                                <div class="info__level-container">
                                    <h3 class="info__summLevel">${json.summonerLevel}</h3>
                                </div>`
                        mainInfo.classList.add('statsChecker__info--active');
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
        fetch( /*`https://cors-anywhere.herokuapp.com/*/ `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`)
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
                                <img class="ranked__tier-image" alt="Tier ${SoloDuoRankedTier} image" src="https://pathfiinder.github.io/Rito-API/images/emblems/Emblem_${SoloDuoRankedTier}.png">
                                <h3 class="ranked__tier"> ${SoloDuoRankedTier} ${SoloDuoRankedDiv}</h3>
                                <h3 class="ranked__stats"><span class="ranked__stats--bold">${SoloDuoRankedPoinst} LP</span> / ${SoloDuoRankedWins}W  / ${SoloDuoRankedLosses}L</h3>
                                <h3 class="ranked__win-ratio"> Win ratio:  ${(SoloDuoRankedWins != 0)?((SoloDuoRankedWins/(SoloDuoRankedWins + SoloDuoRankedLosses)) * 100).toFixed(0) : 0}%</h3>
                            </div>
                            <div class="ranked__single-item" data-ranked="flex">
                                <h2 class="ranked__title">Ranked Flex 5x5 </h2>
                                <img class="ranked__tier-image" alt="Tier ${flexRankedTier} image" src="https://pathfiinder.github.io/Rito-API/images/emblems/Emblem_${flexRankedTier}.png">
                                <h3 class="ranked__tier"> ${flexRankedTier} ${flexRankedDiv}</h3>
                                <h3 class="ranked__stats"><span class="ranked__stats--bold">${flexRankedPoinst} LP</span> / ${flexRankedWins}W  / ${flexRankedLosses}L</h3>
                                <h3 class="ranked__win-ratio"> Win ratio:  ${(flexRankedWins != 0)?((flexRankedWins/(flexRankedWins + flexRankedLosses)) * 100).toFixed(0) : 0}%</h3>
                            </div>
                            <div class="ranked__single-item" data-ranked="ttf">
                                <h2 class="ranked__title">Ranked TTF</h2>
                                <img class="ranked__tier-image" alt="Tier ${ttfRankedTier} image" src="https://pathfiinder.github.io/Rito-API/images/emblems/Emblem_${ttfRankedTier}.png">
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
        fetch('https://ddragon.leagueoflegends.com/cdn/9.17.1/data/en_US/champion.json')
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
        fetch( /*`https://cors-anywhere.herokuapp.com/*/ `https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${apiKey}`)
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
                        <img class="mastery__champion-image" alt="Champion image" src="https://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${firstMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="https://pathfiinder.github.io/Rito-API/images/mastery/lvl${firstMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${firstMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="https://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${secondMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="https://pathfiinder.github.io/Rito-API/images/mastery/lvl${secondMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${secondMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="https://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${thirdMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="https://pathfiinder.github.io/Rito-API/images/mastery/lvl${thirdMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${thirdMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single mastery__single--last">
                        <img class="mastery__champion-image" alt="Champion image" src="https://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${fourthMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="https://pathfiinder.github.io/Rito-API/images/mastery/lvl${fourthMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${fourthMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                `
                infoMasteryStats.classList.add('info__masteryStats--active')

            })
    }

    getHistoryGames = (id) => {
        fetch( /*`https://cors-anywhere.herokuapp.com/*/ `https://eun1.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?api_key=${apiKey}`)
            .then((data) => {
                return data.json();
            })
            .then((json) => {
                [].forEach.call(json.matches, (element, index) => {
                    if (index >= 0 && index <= 9) {
                        historyGamesInfo.push(element);
                    }
                });

                historyGamesInfo.sort((a, b) => {
                    if (a.timestamp < b.timestamp) {
                        return 1;
                    } else {
                        return -1;
                    }
                })

                historyGamesInfo.forEach((element) => {
                    getSingleGameHistory(element.gameId)
                });
                //getSingleGameHistory(historyGamesInfo[0].gameId)


            })
            .catch((error) => console.log(error))
    }

    getSingleGameHistory = (matchID) => {
        fetch( /*`https://cors-anywhere.herokuapp.com/*/ `https://eun1.api.riotgames.com/lol/match/v4/matches/${matchID}?api_key=${apiKey}`)
            .then((data) => {
                return data.json()
            })
            .then((json) => {
                console.log(json);

                getMainPlayerStatsSingleGameHistory(json);

            })
    }

    getMainPlayerStatsSingleGameHistory = (json) => {
        let mainIdTab = "";
        let mainWin = false;
        let mainStatsKill = 0;
        let mainStatsDeaths = 0;
        let mainStatsAssists = 0;
        let mainChampionId = 0;
        let mainChampionName = "";
        let mainSpellPrimary = 0;
        let mainSpellSecondary = 0;
        const gameType = checkGameType(json.queueId);
        let gameDuration = json.gameDuration;

        const mainItems = [];

        [].forEach.call(json.participantIdentities, (element) => {
            if (element.player.summonerName == inputValueNickname.value) {
                mainIdTab = element.participantId;
            }
        });

        [].forEach.call(json.participants, (element, index) => {

            if (element.participantId == mainIdTab) {
                mainWin = element.stats.win;
                mainStatsKill = element.stats.kills;
                mainStatsDeaths = element.stats.deaths;
                mainStatsAssists = element.stats.assists;
                mainChampionId = element.championId;
                mainSpellPrimary = element.spell1Id;
                mainSpellSecondary = element.spell2Id;

                for (let i = 0; i < 7; i++) {
                    const idItem = eval("element.stats.item" + i);
                    if (idItem != 0) {
                        mainItems.push({
                            name: "item" + i,
                            id: idItem
                        });
                    }
                }


            }
        })

        console.log(mainItems)

        championsNameById.forEach(element => {
            if (element.key == mainChampionId) {
                mainChampionName = element.name
            }
        })




        historyGames.innerHTML += `
            <div class="historyGame__single ${mainWin ? "historyGame__single--win" : "historyGame__single--defeat"}">
                <div class="historyGame__info">
                    <h2 class="historyGames__info-type">${gameType}</h2>
                    <h3 class="historyGames__info-result ${mainWin ? "historyGames__info-result--win" : "historyGames__info-result--defeat"}">${mainWin ? "Win" : "Defeat"}</h3>
                    <h3 class="historyGames__info-game-duration">${getGameDuration(gameDuration)}</h3>
                </div>
                <img class="historyGames__player-champion-image" alt="Champion player image: ${mainChampionName}" src="https://ddragon.leagueoflegends.com/cdn/9.17.1/img/champion/${mainChampionName}.png"> 
                <h3 class="historyGames__stats">${mainStatsKill} / ${mainStatsDeaths} / ${mainStatsAssists}</h3>
                <div class="historyGame__spells">
                    <img class="historyGame__spells--primary" alt="Spells image" src="../images/spells/Summoner${getSpellName(mainSpellPrimary)}.png">
                    <img class="historyGame__spells--secondary" alt="Spells image" src="../images/spells/Summoner${getSpellName(mainSpellSecondary)}.png">
                </div>
                <div class="historyGame__mainItems mainItems">
                    ${countItems(mainItems)}
                 </div>
            </div>
        `;



        historyGames.classList.add('info__historyGames--active');

    }

    countItems = (items) => {
        let html = ``
        items.forEach((element, index) => {
            let order = index;
            if (order == 3) {
                order++;
            }
            if (element.name == "item6") {
                html += `<img class="mainItems__single mainItems__single--item6" style="order: 3" alt="Item ${element.id} image" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/item/${element.id}.png">`;
            } else {
                html += `<img class="mainItems__single" style="order: ${order == 3 ? order++ : order}" alt="Item ${element.id} image" src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/item/${element.id}.png">`;
            }
        })
        return html;
    }



    getSpellName = (idSpell) => {

        let spellName = ""
        spellsIdWithName.forEach((element) => {
            if (element.id == idSpell) {
                spellName = element.name
            }
        })

        return spellName;
    }


    getGameDuration = (nrOfSecond) => {
        const pad = function (num, size) {
            return ('000' + num).slice(size * -1);
        };
        const time = parseFloat(nrOfSecond).toFixed(3);
        const hours = Math.floor(time / 60 / 60);
        const minutes = Math.floor(time / 60) % 60;
        const seconds = Math.floor(time - minutes * 60);

        if (hours != "00") {
            return pad(hours, 2) + 'h ' + pad(minutes, 2) + 'm ' + pad(seconds, 2) + 's';
        } else {
            return pad(minutes, 2) + 'm ' + pad(seconds, 2) + 's';
        }

    }


    checkGameType = (queueId) => {
        if (queueId == draftIdQueue) {
            return "Draft Pick";
        } else if (queueId == rankedSoloDuoIdQueue) {
            return "Ranked Solo/Duo";
        } else if (queueId == blindDraftIdQueue) {
            return "Blind pick";
        } else if (queueId == flexIdQueue) {
            return "Ranked Flex";
        } else if (queueId == aramIdQueue) {
            return "Aram";
        } else if (queueId == twistedRankedIdQueue) {
            return "Ranked Flex";
        } else if (queueId == ttfIdQueue) {
            return "Teamfight Tacticts";
        } else if (queueId == botsIdQueue) {
            return "Bots"
        }
    }

    btn.addEventListener('click', (event) => {
        event.preventDefault();


        main(inputValueNickname.value);


        //inputValueNickname.value = "";
    });
})