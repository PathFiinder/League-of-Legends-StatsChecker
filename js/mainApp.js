document.addEventListener('DOMContentLoaded', function () {

    const apiKey = 'RGAPI-e0ab4a84-486b-4975-a291-1abe4ea2626c';

    const statsCheckerButton = document.querySelector('.main__buttons--stats');
    const championsButton = document.querySelector('.main__buttons--champions');
    const itemsButton = document.querySelector('.main__buttons--items');
    const mainStatsChecker = document.querySelector('.main__statsChecker');
    const mainChampions = document.querySelector('.main__champions');
    const mainItems = document.querySelector('.main__items')

    const itemsList = document.querySelector('.items__list');
    const itemsInput = document.querySelector('.items__input');
    const championsList = document.querySelector('.champions__list');
    const statsCheckerError = document.querySelector('.statsChecker__errors');
    const btnSearch = document.querySelector('.statsChecker__button');
    const mainInfo = document.querySelector('.statsChecker__info');
    const inputValueNickname = document.querySelector('.statsChecker__input');
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
    let itemsInfo = [];
    let historyGamesInfo = [];
    const draftIdQueue = 400;
    const rankedSoloDuoIdQueue = 420;
    const blindDraftIdQueue = 430;
    const flexIdQueue = 440;
    const aramIdQueue = 450;
    const twistedRankedIdQueue = 470;
    const ttfIdQueue = 1100;
    const botsIdQueue = 850;




    //StatsChecker Functions

    main = (nickname) => {
        if (nickname != null) {

            historyGames.innerHTML = " ";
            historyGamesInfo = [];
            mainInfo.classList.remove('statsChecker__info--active');


            fetch(`https://cors-anywhere.herokuapp.com/https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}?api_key=${apiKey}`)
                .then((data) => {
                    if (data.status == 200) {
                        statsCheckerError.textContent = "";
                        statsCheckerError.classList.remove('statsChecker__errors--active');
                        return data.json();
                    } else if (data.status == 404) {
                        statsCheckerError.innerHTML = "Invalid nickname"
                        statsCheckerError.classList.add('statsChecker__errors--active');
                    } else {
                        console.log(data.status)
                    }
                })
                .then((json) => {



                    if (json != null) {
                        infoAccStats.innerHTML = `
                                <img src="https://ddragon.leagueoflegends.com/cdn/9.20.1/img/profileicon/${json.profileIconId}.png" alt="Profil Icon" class="info__profilIcon">
                                <h2 class="info__nickname">${json.name}</h2>
                                <div class="info__level-container">
                                    <h3 class="info__summLevel">${json.summonerLevel}</h3>
                                </div>`
                        mainInfo.classList.add('statsChecker__info--active');
                        infoAccStats.classList.add('info__accStats--active');

                        getRank(json.id);
                        getMastery(json.id);
                        getHistoryGames(json.accountId)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    getRank = (id) => {
        fetch(`https://cors-anywhere.herokuapp.com/https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`)
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

                }
            })
            .catch(err => console.log("error     " + err))
    }

    getChampions = () => {
        fetch('https://ddragon.leagueoflegends.com/cdn/9.20.1/data/en_US/champion.json')
            .then((data) => {
                return data.json();
            })
            .then((json) => {


                [].forEach.call(Object.values(json.data), (ele, index) => {
                    championsNameById.push({
                        name: ele.id,
                        key: parseInt(ele.key, 10),
                        title: ele.title,
                        hp: ele.stats.hp,
                        mana: ele.stats.mp,
                        movespeed: ele.stats.movespeed,
                        armor: ele.stats.armor,
                        attackRange: ele.stats.attackrange,
                        critic: ele.stats.crit,
                        dmg: ele.stats.attackdamage,
                        attackSpeed: ele.stats.attackspeed,
                        magicResistance: ele.stats.spellblock
                    })
                });

            })
            .catch((error) => console.log(error));

    }

    getChampions();

    getMastery = (id) => {
        fetch(`https://cors-anywhere.herokuapp.com/https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${apiKey}`)
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
                        <img class="mastery__champion-image" alt="Champion image" src="images/champions/${firstMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${firstMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${firstMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="images/champions/${secondMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${secondMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${secondMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single">
                        <img class="mastery__champion-image" alt="Champion image" src="images/champions/${thirdMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${thirdMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${thirdMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                    <div class="mastery__single mastery__single--last">
                        <img class="mastery__champion-image" alt="Champion image" src="images/champions/${fourthMainChampionName}.png">
                        <img class="mastery__level-image" alt="Mastery level  image" src="images/mastery/lvl${fourthMainChampion.championLevel}.png">
                        <h3 class="mastery__points">${fourthMainChampion.championPoints} <span class="mastery__points--normal">pts</span></h3>
                    </div>
                `
                infoMasteryStats.classList.add('info__masteryStats--active')

            })
    }

    getHistoryGames = (id) => {
        fetch(`https://cors-anywhere.herokuapp.com/https://eun1.api.riotgames.com/lol/match/v4/matchlists/by-account/${id}?api_key=${apiKey}`)
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

                historyGamesInfo.forEach((element, index) => {
                    getSingleGameHistory(element.gameId, index)
                });

            })
            .catch((error) => console.log(error))
    }

    getSingleGameHistory = (matchID, singleId) => {
        fetch(`https://cors-anywhere.herokuapp.com/https://eun1.api.riotgames.com/lol/match/v4/matches/${matchID}?api_key=${apiKey}`)
            .then((data) => {
                return data.json()
            })
            .then((json) => {
                getMainPlayerStatsSingleGameHistory(json, singleId);
            })
    }

    getMainPlayerStatsSingleGameHistory = (json, singleId) => {
        let mainIdTab = "";
        let mainWin = false;
        let mainStatsKill = 0;
        let mainStatsDeaths = 0;
        let mainStatsAssists = 0;
        let mainChampionId = 0;
        let mainChampionName = "";
        let mainSpellPrimary = 0;
        let mainSpellSecondary = 0;
        let mainChampLevel = 0;
        let mainGoldEarned = 0;
        let mainGoldSpent = 0;
        let mainLargestMultiKill = 0;
        let mainTotalMinionsKileld = 0;
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
                mainChampLevel = element.stats.champLevel;
                mainGoldEarned = element.stats.goldEarned;
                mainGoldSpent = element.stats.goldSpent;
                mainTotalMinionsKileld = element.stats.totalMinionsKilled;
                mainLargestMultiKill = element.stats.largestMultiKill;

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

        championsNameById.forEach(element => {
            if (element.key == mainChampionId) {
                mainChampionName = element.name
            }
        })

        historyGames.innerHTML += `
            <div class="historyGame__single ${mainWin ? "historyGame__single--win" : "historyGame__single--defeat"} historyGame__single--normal" data-singleId ="${singleId}">
                <div class="historyGame__info">
                    <h2 class="historyGames__info-type">${gameType}</h2>
                    <h3 class="historyGames__info-result ${mainWin ? "historyGames__info-result--win" : "historyGames__info-result--defeat"}">${mainWin ? "Win" : "Defeat"}</h3>
                    <h3 class="historyGames__info-game-duration">${getGameDuration(gameDuration)}</h3>
                </div>
                <h3 class="historyGames__champion-name"> ${mainChampionName == "MonkeyKing" ? "Wukong" : mainChampionName} </h3>
                <img class="historyGames__player-champion-image" alt="Champion player image: ${mainChampionName}" src="images/champions/${mainChampionName}.png"> 
                <h3 class="historyGames__stats">${mainStatsKill} / ${mainStatsDeaths} / ${mainStatsAssists}</h3>
                <h3 class="historyGames__largest-multi-kill" style="display: ${mainLargestMultiKill >= 2 ? "block" : "none"}">${countLargestMultiKill(mainLargestMultiKill)}</h3>
                <div class="historyGame__spells">
                    <img class="historyGame__spells--primary" alt="Spells image" src="images/spells/Summoner${getSpellName(mainSpellPrimary)}.png">
                    <img class="historyGame__spells--secondary" alt="Spells image" src="images/spells/Summoner${getSpellName(mainSpellSecondary)}.png">
                </div>
                <div class="historyGame__mainItems mainItems">
                    ${countItemsMain(mainItems)}
                </div>
                <div class="historyGame__mainData mainData">
                    <h3 class="mainData__champLevel">Level: ${mainChampLevel}</h3>
                    <h3 class="mainData__minions">${mainTotalMinionsKileld} CS</h3>
                    <h3 class="mainData__gold">Gold: ${mainGoldSpent} / ${mainGoldEarned} </h3>
                </div>
                <div class="historyGame__players-list playersList">
                </div>
                <i class="historyGame__arrow fas fa-arrow-circle-down" data-singleArrowId="${singleId}"></i>
                <div class="historyGame__players-stats playersStats">
                </div>
            </div>
        `;

        historyGames.classList.add('info__historyGames--active');
        getHistoryGamePlayersList(json, singleId);
    }

    getHistoryGamePlayersList = (json, singleId) => {
        const playerList = [];
        const teamStats = [];

        [].forEach.call(json.participantIdentities, (element) => {
            playerList.push({
                participantId: element.participantId,
                playerNick: element.player.summonerName,
                playerIcon: element.player.profileIcon
            })
        });

        previousData = (index) => {
            const temp = [];
            playerList.forEach((element, indexIn) => {
                if (indexIn == index) {
                    temp.push(element)
                }
            })
            return temp;
        }

        playerList.forEach((elementOut, indexOut) => {
            [].forEach.call(json.participants, (elementIn) => {
                if (elementOut.participantId == elementIn.participantId) {
                    const data = previousData(indexOut)
                    playerList[indexOut] = [...data, {
                        championId: elementIn.championId,
                        spell1Id: elementIn.spell1Id,
                        spell2Id: elementIn.spell2Id,
                        teamId: elementIn.teamId,
                        assists: elementIn.stats.assists,
                        champLevel: elementIn.stats.champLevel,
                        deaths: elementIn.stats.deaths,
                        goldEarned: elementIn.stats.goldEarned,
                        goldSpent: elementIn.stats.goldSpent,
                        item0: elementIn.stats.item0,
                        item1: elementIn.stats.item1,
                        item2: elementIn.stats.item2,
                        item3: elementIn.stats.item3,
                        item4: elementIn.stats.item4,
                        item5: elementIn.stats.item5,
                        item6: elementIn.stats.item6,
                        kills: elementIn.stats.kills,
                        largestMultiKill: elementIn.stats.largestMultiKill,
                        totalDamageDealtToChampions: elementIn.stats.totalDamageDealtToChampions,
                        totalMinionsKilled: elementIn.stats.totalMinionsKilled,
                        win: elementIn.stats.win
                    }]
                }
            })
        });

        [].forEach.call(json.teams, (element) => {
            teamStats.push({
                teamId: element.teamId,
                baronKills: element.baronKills,
                dragonKills: element.dragonKills,
                inhibitorKills: element.inhibitorKills,
                riftHeraldKills: element.riftHeraldKills,
                towerKills: element.towerKills,
                win: element.win,
                bans: element.bans
            })
        });


        const teamOneStats = [];
        const teamTwoStats = [];
        let teamOneKills = 0;
        let teamOneDeaths = 0;
        let teamOneAssist = 0;
        let teamTwoKills = 0;
        let teamTwoDeaths = 0;
        let teamTwoAssist = 0;

        playerList.forEach((element) => {
            if (element[1].teamId == 100) {
                teamOneStats.push({
                    kills: element[1].kills,
                    deaths: element[1].deaths,
                    assists: element[1].assists
                })
            } else if (element[1].teamId == 200) {
                teamTwoStats.push({
                    kills: element[1].kills,
                    deaths: element[1].deaths,
                    assists: element[1].assists
                })
            }
        });

        teamOneStats.forEach(element => {
            teamOneKills += element.kills;
            teamOneDeaths += element.deaths;
            teamOneAssist += element.assists;
        });


        teamTwoStats.forEach(element => {
            teamTwoKills += element.kills;
            teamTwoDeaths += element.deaths;
            teamTwoAssist += element.assists;
        });


        document.querySelector(`[data-singleId ="${singleId}"] .historyGame__players-list`).innerHTML = `
            <div class="playersList__team" data-team=100>
            ${getPlayersListShort(playerList,100)}
            </div>
            <div class="playersList__team" data-team=200>
            ${getPlayersListShort(playerList,200)}
            </div>
        `


        document.querySelector(`[data-singleId ="${singleId}"] .historyGame__players-stats`).innerHTML = `
            <div class="playerStats__team-result">
                <h3 class="playerStats__result">Team: ${(teamStats[0].teamId + "").slice(0,1)} <span class="playerStats__result--bold ${teamStats[0].win == "Win" ? "playerStats__result--win" : "playerStats__result--defeat"}">${teamStats[0].win == "Win" ? "Win" : "Defeat"}</span></h3>
                <h3 class="playerStats__stats">${teamOneKills} / ${teamOneDeaths} / ${teamOneAssist}</h3>
                <div class="playerStats__bans ${teamStats[0].bans.length != 0 ? "playerStats__bans--active" : "playerStats__bans--disable"}">
                    <h3 class="playerStats__bans-title"> ${teamStats[0].bans.length != 0 ? "Bans:" : "" }</h3>
                    ${getTeamBans(teamStats,100)}
                </div>
                <div class="playerStats__specialObj specialObj">
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Tower image" src="images/specialObj/towers.png">
                        <h3 class="specialObj__stats">${teamStats[0].towerKills}</h3>
                    </div>
                     <div class="specialObj__single">
                        <img class="specialObj__image" alt="Inhibitors image" src="images/specialObj/inhibitors.png">
                        <h3 class="specialObj__stats">${teamStats[0].inhibitorKills}</h3>
                    </div>
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Baron image" src="images/specialObj/baron.png">
                        <h3 class="specialObj__stats">${teamStats[0].baronKills}</h3>
                    </div>
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Dragon image" src="images/specialObj/dragons.png">
                        <h3 class="specialObj__stats">${teamStats[0].dragonKills}</h3>
                    </div>
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Herald image" src="images/specialObj/herald.png">
                        <h3 class="specialObj__stats">${teamStats[0].riftHeraldKills}</h3>
                    </div>
                </div>
            </div>
            <div class="playerStats__team ${teamStats[0].win == "Win" ? "playerStats__team--win" : "playerStats__team--defeat"}" data-team="100">
                ${getPlayerListAllInfo(playerList,100)}
            </div>
            <div class="playerStats__team-result">
                <h3 class="playerStats__result">Team: ${(teamStats[1].teamId + "").slice(0,1)} <span class="playerStats__result--bold ${teamStats[1].win == "Win" ? "playerStats__result--win" : "playerStats__result--defeat"}">${teamStats[1].win == "Win" ? "Win" : "Defeat"}</span></h3>
                <h3 class="playerStats__stats">${teamTwoKills} / ${teamTwoDeaths} / ${teamTwoAssist}</h3>
                <div class="playerStats__bans ${teamStats[1].bans.length != 0 ? "playerStats__bans--active" : "playerStats__bans--disable"}">
                <h3 class="playerStats__bans-title"> ${teamStats[1].bans.length != 0 ? "Bans:" : "" }</h3>
                    ${getTeamBans(teamStats,200)}
                </div>
                <div class="playerStats__specialObj specialObj">
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Tower image" src="images/specialObj/towers.png">
                        <h3 class="specialObj__stats">${teamStats[1].towerKills}</h3>
                    </div>
                     <div class="specialObj__single">
                        <img class="specialObj__image" alt="Inhibitors image" src="images/specialObj/inhibitors.png">
                        <h3 class="specialObj__stats">${teamStats[1].inhibitorKills}</h3>
                    </div>
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Baron image" src="images/specialObj/baron.png">
                        <h3 class="specialObj__stats">${teamStats[1].baronKills}</h3>
                    </div>
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Dragon image" src="images/specialObj/dragons.png">
                        <h3 class="specialObj__stats">${teamStats[1].dragonKills}</h3>
                    </div>
                    <div class="specialObj__single">
                        <img class="specialObj__image" alt="Herald image" src="images/specialObj/herald.png">
                        <h3 class="specialObj__stats">${teamStats[1].riftHeraldKills}</h3>
                    </div>
                </div>
            </div>
            <div class="playerStats__team ${teamStats[1].win == "Win" ? "playerStats__team--win" : "playerStats__team--defeat team"}" data-team="200">
            ${getPlayerListAllInfo(playerList,200)}
            </div>
        `
    }

    getTeamBans = (teamStats, teamId) => {
        let innerBans = ""
        teamStats.forEach(elementOut => {
            if (elementOut.teamId == teamId) {
                [].forEach.call(elementOut.bans, (elementIn) => {
                    let champName = "";

                    championsNameById.forEach(ele => {
                        if (ele.key == elementIn.championId) {
                            champName = ele.name;
                        }
                    })

                    innerBans += ` 
                    <img class="playerStats__bans-single" alt="Banned champ image" src="images/champions/${champName}.png">
                    `
                })
            }
        })
        return innerBans;
    }

    getPlayerListAllInfo = (playerList, idTeam) => {

        let innerItem = ""
        let champName = "";


        singlePlayerItems = (items) => {
            let innerItemsSet = "";

            items.forEach(element => {
                if (element != 0) {
                    innerItemsSet += `
                    <img class="team__single-item" alt="Item image" src="images/items/${element}.png">
                `
                }
            })
            return innerItemsSet;
        }



        singlePlayer = (nick, idChamp, champLlvl, spell1, spell2, kills, deaths, assists, dmg, minions, gEarned, gSpent, items) => {

            championsNameById.forEach(element => {
                if (element.key == idChamp) {
                    champName = element.name;
                }
            });


            return `
            <div class="team__single">
                <img class="team__champ-image" alt="Champion image" src="images/champions/${champName}.png">
                <h3 class="team__champ-level">${champLlvl}</h3>
                <div class="team__spells">
                    <img class="team__single-spell" alt="Spell image" src="images/spells/Summoner${getSpellName(spell1)}.png">
                    <img class="team__single-spell" alt="Spell image" src="images/spells/Summoner${getSpellName(spell2)}.png">
                </div>
                <h3 class="team__player-nickname">${nick}</h3>
                <h3 class="team__player-stats">${kills} / ${deaths} / ${assists}</h3>
                <h3 class="team__player-dmg"><span class="team__player-dmg--bold">Dmg:</span> ${dmg}</h3>
                <h3 class="team__player-cs"><span class="team__player-cs--bold">CS:</span> ${minions} </h3>
                <h3 class="team__player-gold"><span class="team__player-gold--bold">Gold: </span>${gSpent} / ${gEarned}</h3>
                <div class="team__player-items">
                ${singlePlayerItems(items)}
                </div>
            </div>
            `
        };


        playerList.forEach((element) => {
            let Items = [];
            if (element[1].teamId == idTeam) {
                Items.push(element[1].item0, element[1].item1, element[1].item2, element[1].item3, element[1].item4, element[1].item5, element[1].item6);
                innerItem += singlePlayer(element[0].playerNick, element[1].championId, element[1].champLevel, element[1].spell1Id, element[1].spell2Id, element[1].kills, element[1].deaths, element[1].assists, element[1].totalDamageDealtToChampions, element[1].totalMinionsKilled, element[1].goldEarned, element[1].goldSpent, Items);
            }
        });

        return innerItem;

    }


    getPlayersListShort = (playerList, idTeam) => {
        let playerListShort = "";
        playerList.forEach((element, index) => {
            if (element[1].teamId == idTeam) {
                playerListShort += `
                <div class="playerList__single">
                    <img class="playerList__iconImage" alt="Icon image" src="https://ddragon.leagueoflegends.com/cdn/9.20.1/img/profileicon/${element[0].playerIcon}.png">
                    <h3 class="playerList__nickName">${element[0].playerNick}</h3>
                </div>
                `
            }
        })

        return playerListShort

    }

    countLargestMultiKill = (multiKill) => {
        if (multiKill == 2) {
            return "Double Kill";
        } else if (multiKill == 3) {
            return "Triple Kill";
        } else if (multiKill == 4) {
            return "Quadra Kill";
        } else if (multiKill == 5) {
            return "Penta Kill"
        }
    }

    countItemsMain = (items) => {
        let html = ``
        items.forEach((element, index) => {
            let order = index;
            if (order == 3) {
                order++;
            }
            if (element.name == "item6") {
                html += `<img class="mainItems__single mainItems__single--item6" style="order: 3" alt="Item ${element.id} image" src="images/items/${element.id}.png">`;
            } else {
                html += `<img class="mainItems__single" style="order: ${order == 3 ? order++ : order}" alt="Item ${element.id} image" src="images/items/${element.id}.png">`;
            }
        })
        return html;
    }

    getSpellName = (idSpell) => {
        let spellName = "";

        if (idSpell == 0) {
            spellName = "0"
        } else {

            spellsIdWithName.forEach((element) => {
                if (element.id == idSpell) {
                    spellName = element.name
                }
            })

        }
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
            return "Bots";
        } else {
            return "Other game";
        }
    }

    //Champions Functions

    createChampionsList = (championList) => {
        championsNameById.forEach(element => {
            championList.innerHTML += createSingleChampion(element);

        })
    }

    createSingleChampion = (champion) => {
        let innerChamp = "";
        innerChamp = `
            <div class="champion__single">
                <h3 class="champion__name">${champion.name}</h3>
                <h3 class="champion__title">${(champion.title).charAt(0).toUpperCase() + (champion.title).slice(1)}</h3>
                <img class="champion__image" alt="Champion ${champion.name} image" src="images/champions/${champion.name}.png">
                <h3 class="champion__stats-title">Stats: </h3>
                <ul class="champion__stats-list">
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Health: </span>${champion.hp}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Mana: </span>${champion.mana}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Movespeed: </span>${champion.movespeed}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Armor: </span>${champion.armor}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Attack range: </span>${champion.attackRange}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Critical strike: </span>${champion.critic}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Attacking dmg: </span>${champion.dmg}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Attack speed: </span>${champion.attackSpeed}</li>
                    <li class="champion__single-stat"><span class="champion__single-stat--underline">Magic resistance: </span>${champion.magicResistance}</li>
                </ul>
            </div>
        `

        return innerChamp;
    };

    //Items Functions

    getItemsDetails = () => {
        fetch('https://pathfiinder.github.io/League-of-Legends-StatsChecker/json/item.json')
            .then(data => data.json())
            .then(json => {

                [].forEach.call(Object.values(json.data), (element) => {
                    itemsInfo.push({
                        name: element.name,
                        description: element.description,
                        image: element.image.full,
                        priceGold: element.gold.total,
                        sellGold: element.gold.sell,
                        tags: element.tags
                    })

                })

                itemsInfo.sort((a, b) => {
                    if (a.priceGold > b.priceGold) {
                        return 1;
                    } else {
                        return -1;
                    }
                })

                createItemList(itemsInfo);

            })
            .catch(error => console.log(error))
    }

    createItemList = (itemList) => {
        itemList.forEach(element => {
            itemsList.innerHTML += createSingleItem(element);
        })
    }

    createSingleItem = (item) => {
        let innerSingleItem = "";

        function getMatches(string, regex, index) {
            index || (index = 1);
            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push(match[index]);
            }
            return matches;
        }


        let statsString = item.description;
        let regexStats = /(<\s*stats[^>]*>)(.+)(<\s*\/\s*stats>)/g;
        const matches = getMatches(statsString, regexStats, 2);

        let singleStatsString = JSON.stringify(matches).split('<br>');
        const regexToSingleStats = /[^\\"[](.+[+\w])/g;
        const singleStats = getMatches(singleStatsString, regexToSingleStats, 0)

        const stats = ("" + singleStats[0]).split(',');

        singleStat = () => {
            let innerStat = "";

            stats.forEach(element => {
                innerStat += `
                <li class="items__single-stat">${element}</li>
                `
            });

            return innerStat;
        }


        innerSingleItem = `
            <div class="items__single" data-itemId=${((item.image).slice(0,4))}>
                <img class="items__image" alt="Item image" src="images/items/${item.image}">
                <h3 class="items__price"><span class="items__price--bold">Price: </span>${item.priceGold}</h3>
                <h3 class="items__sell"><span class="items__sell--bold">Sale for:  </span>${item.sellGold}</h3>
                <h3 class="items__name">${item.name}</h3>
                <h3 class="items__stats-title ${stats[0] != "undefined" ? "items__stats-title--active" : ""}">${stats[0] != "undefined" ? "Stats: " : ""}</h3>
                <ul class="items__stats-list ${stats[0] != "undefined" ? "items__stats-list--active" : ""}">
                    ${singleStat()}
                </ul>
            </div>
        `

        return innerSingleItem;
    }

    searchItemByName = (itemName) => {
        itemsInfo.forEach(element => {
            if ((element.name).toLowerCase().includes(itemName.toLowerCase())) {
                itemsList.innerHTML += createSingleItem(element);
            }
        });

    }

    itemsInput.addEventListener('input', (event) => {
        if (event.target.value != "") {
            while (itemsList.firstChild) {
                itemsList.removeChild(itemsList.firstChild);
            }
            searchItemByName(event.target.value)
        } else if (event.target.value == "") {
            itemsInfo = [];
            getItemsDetails();
        }
    });


    //Events

    statsCheckerButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!statsCheckerButton.classList.contains('main__buttons--active')) {
            statsCheckerButton.classList.add('main__buttons--active');
            if (!mainStatsChecker.classList.contains('main__statsChecker--active')) {
                mainStatsChecker.classList.add('main__statsChecker--active');
            }
            championsButton.classList.remove('main__buttons--active');
            itemsButton.classList.remove('main__buttons--active')
            mainChampions.classList.remove('main__champions--active');
            mainItems.classList.remove('main__items--active');
        }
    });

    championsButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!championsButton.classList.contains('main__buttons--active')) {
            championsButton.classList.add('main__buttons--active');
            if (!mainChampions.classList.contains('main__champions--active')) {
                mainChampions.classList.add('main__champions--active');
            }
            statsCheckerButton.classList.remove('main__buttons--active');
            itemsButton.classList.remove('main__buttons--active')
            mainStatsChecker.classList.remove('main__statsChecker--active');
            mainItems.classList.remove('main__items--active');

            if (championsNameById.length != 0) {
                if (championsList.innerHTML == "") {
                    createChampionsList(championsList);
                }

            }
        }
    });


    itemsButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (!itemsButton.classList.contains('main__buttons--active')) {
            itemsButton.classList.add('main__buttons--active');
            if (!mainItems.classList.contains('main__items--active')) {
                mainItems.classList.add('main__items--active');
            }
            statsCheckerButton.classList.remove('main__buttons--active');
            championsButton.classList.remove('main__buttons--active')
            mainStatsChecker.classList.remove('main__statsChecker--active');
            mainChampions.classList.remove('main__champions--active');
        }
        if (itemsInfo.length == 0) {
            getItemsDetails();
        }
    });


    btnSearch.addEventListener('click', (event) => {
        event.preventDefault();
        main(inputValueNickname.value);
    });

    inputValueNickname.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            btnSearch.click();
        }
    })


    mainInfo.addEventListener('click', (event) => {

        if (event.target.dataset.singlearrowid) {
            const singleId = event.target.dataset.singlearrowid;
            if (document.querySelector(`[data-singleArrowId = "${singleId}"]`).classList.contains('fa-arrow-circle-down')) {
                document.querySelector(`[data-singleId = "${singleId}"]`).classList.remove('historyGame__single--normal');
                document.querySelector(`[data-singleId = "${singleId}"]`).classList.add('historyGame__single--active');
                document.querySelector(`[data-singleArrowId = "${singleId}"]`).classList.remove('fa-arrow-circle-down');
                document.querySelector(`[data-singleArrowId = "${singleId}"]`).classList.add('fa-arrow-circle-up');
                document.querySelector(`[data-singleId ="${singleId}"] .historyGame__players-stats`).classList.add('historyGame__players-stats--active');
            } else if (document.querySelector(`[data-singleArrowId = "${singleId}"]`).classList.contains('fa-arrow-circle-up')) {
                document.querySelector(`[data-singleId = "${singleId}"]`).classList.remove('historyGame__single--active');
                document.querySelector(`[data-singleId = "${singleId}"]`).classList.add('historyGame__single--normal');
                document.querySelector(`[data-singleArrowId = "${singleId}"]`).classList.remove('fa-arrow-circle-up');
                document.querySelector(`[data-singleArrowId = "${singleId}"]`).classList.add('fa-arrow-circle-down');
                document.querySelector(`[data-singleId ="${singleId}"] .historyGame__players-stats`).classList.remove('historyGame__players-stats--active');
            }
        }
    })


})