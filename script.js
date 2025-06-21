document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const teamCountSelect = document.getElementById('team-count');
    const teamsList = document.getElementById('teams-list');
    const randomTeamsBtn = document.getElementById('random-teams');
    const generateBtn = document.getElementById('generate-tournament');
    const tournamentView = document.getElementById('tournament-view');
    const tournamentNameInput = document.getElementById('tournament-name');
    const tournamentTypeSelect = document.getElementById('tournament-type');
    
    // Przykładowe nazwy drużyn do losowania
    const sampleTeams = [
        "FC Barcelona", "Real Madrid", "Manchester United", "Liverpool FC", 
        "Bayern Monachium", "Paris Saint-Germain", "Juventus Turyn", "AC Milan",
        "Chelsea FC", "Arsenal FC", "Manchester City", "Tottenham Hotspur",
        "Borussia Dortmund", "Atletico Madryt", "Inter Mediolan", "AS Roma",
        "Ajax Amsterdam", "FC Porto", "Benfica Lizbona", "Celtic Glasgow"
    ];
    
    // Kolory dla drużyn
    const teamColors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', 
        '#9b59b6', '#1abc9c', '#d35400', '#34495e',
        '#27ae60', '#c0392b', '#2980b9', '#8e44ad',
        '#16a085', '#e67e22', '#7f8c8d', '#2c3e50'
    ];
    
    // Inicjalizacja drużyn
    function initializeTeams() {
        teamsList.innerHTML = '';
        const teamCount = parseInt(teamCountSelect.value);
        
        for (let i = 0; i < teamCount; i++) {
            const teamDiv = document.createElement('div');
            teamDiv.className = 'team-input';
            
            const teamInput = document.createElement('input');
            teamInput.type = 'text';
            teamInput.placeholder = `Drużyna ${i + 1}`;
            teamInput.dataset.index = i;
            
            const colorBox = document.createElement('div');
            colorBox.className = 'team-color';
            colorBox.style.backgroundColor = teamColors[i % teamColors.length];
            colorBox.dataset.index = i;
            colorBox.addEventListener('click', changeTeamColor);
            
            teamDiv.appendChild(teamInput);
            teamDiv.appendChild(colorBox);
            teamsList.appendChild(teamDiv);
        }
    }
    
    // Zmiana koloru drużyny
    function changeTeamColor(e) {
        const index = parseInt(e.target.dataset.index);
        const currentColor = e.target.style.backgroundColor;
        const currentColorIndex = teamColors.indexOf(rgbToHex(currentColor));
        
        let nextColorIndex = (currentColorIndex + 1) % teamColors.length;
        if (nextColorIndex === index % teamColors.length) {
            nextColorIndex = (nextColorIndex + 1) % teamColors.length;
        }
        
        e.target.style.backgroundColor = teamColors[nextColorIndex];
    }
    
    // Konwersja RGB na HEX
    function rgbToHex(rgb) {
        if (!rgb || rgb === '') return '#000000';
        
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return '#000000';
        
        const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
        const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
        const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`.toUpperCase();
    }
    
    // Losowanie drużyn
    function randomizeTeams() {
        const teamInputs = teamsList.querySelectorAll('input');
        const shuffledTeams = [...sampleTeams].sort(() => 0.5 - Math.random());
        
        teamInputs.forEach((input, index) => {
            input.value = shuffledTeams[index] || `Drużyna ${index + 1}`;
        });
    }
    
    // Generowanie turnieju
    function generateTournament() {
        const tournamentName = tournamentNameInput.value || 'Turniej Piłkarski';
        const tournamentType = tournamentTypeSelect.value;
        const teamInputs = teamsList.querySelectorAll('.team-input');
        
        const teams = Array.from(teamInputs).map(teamDiv => {
            const input = teamDiv.querySelector('input');
            const colorBox = teamDiv.querySelector('.team-color');
            
            return {
                name: input.value || input.placeholder,
                color: colorBox.style.backgroundColor || '#cccccc'
            };
        });
        
        // Sprawdź czy są wystarczające drużyny
        if (teams.length < 2) {
            alert('Potrzebujesz przynajmniej 2 drużyn, aby utworzyć turniej!');
            return;
        }
        
        // Wyczyść widok turnieju
        tournamentView.innerHTML = '';
        
        // Utwórz nagłówek turnieju
        const tournamentHeader = document.createElement('div');
        tournamentHeader.className = 'tournament-header';
        
        const tournamentTitle = document.createElement('h2');
        tournamentTitle.className = 'tournament-title';
        tournamentTitle.textContent = tournamentName;
        
        tournamentHeader.appendChild(tournamentTitle);
        tournamentView.appendChild(tournamentHeader);
        
        // Generuj odpowiedni typ turnieju
        if (tournamentType === 'playoffs') {
            generatePlayoffBracket(teams);
        } else if (tournamentType === 'groups+playoffs') {
            generateGroupsAndPlayoffs(teams);
        } else if (tournamentType === 'league') {
            generateLeagueTable(teams);
        }
    }
    
    // Generowanie systemu pucharowego
    function generatePlayoffBracket(teams) {
        // Upewnij się, że liczba drużyn jest potęgą 2
        let bracketSize = 2;
        while (bracketSize * 2 <= teams.length) {
            bracketSize *= 2;
        }
        
        // Losowo wybierz drużyny do turnieju
        const shuffledTeams = [...teams].sort(() => 0.5 - Math.random()).slice(0, bracketSize);
        
        // Utwórz rundy
        let currentRound = shuffledTeams;
        let roundNumber = 1;
        
        while (currentRound.length > 1) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            
            const roundTitle = document.createElement('h3');
            roundTitle.className = 'round-title';
            
            if (currentRound.length === 2) {
                roundTitle.textContent = 'Finał';
            } else if (currentRound.length === 4) {
                roundTitle.textContent = 'Półfinały';
            } else if (currentRound.length === 8) {
                roundTitle.textContent = 'Ćwierćfinały';
            } else {
                roundTitle.textContent = `Runda ${roundNumber}`;
            }
            
            roundDiv.appendChild(roundTitle);
            
            const nextRound = [];
            
            for (let i = 0; i < currentRound.length; i += 2) {
                const team1 = currentRound[i];
                const team2 = currentRound[i + 1];
                
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match';
                
                const team1Div = document.createElement('div');
                team1Div.className = 'match-team';
                team1Div.innerHTML = `
                    <span style="color: ${team1.color}">${team1.name}</span>
                    <input type="number" class="match-score" min="0" value="0">
                `;
                
                const team2Div = document.createElement('div');
                team2Div.className = 'match-team';
                team2Div.innerHTML = `
                    <span style="color: ${team2.color}">${team2.name}</span>
                    <input type="number" class="match-score" min="0" value="0">
                `;
                
                matchDiv.appendChild(team1Div);
                matchDiv.appendChild(team2Div);
                roundDiv.appendChild(matchDiv);
                
                // Dla uproszczenia, zakładamy że zawsze wygrywa pierwsza drużyna
                nextRound.push(team1);
            }
            
            tournamentView.appendChild(roundDiv);
            currentRound = nextRound;
            roundNumber++;
        }
        
        // Dodaj zwycięzcę
        if (currentRound.length === 1) {
            const winnerDiv = document.createElement('div');
            winnerDiv.className = 'winner';
            winnerDiv.innerHTML = `
                <h3>Zwycięzca:</h3>
                <div class="winner-team" style="color: ${currentRound[0].color}">
                    ${currentRound[0].name}
                </div>
            `;
            tournamentView.appendChild(winnerDiv);
        }
    }
    
    // Generowanie fazy grupowej i play-offów
    function generateGroupsAndPlayoffs(teams) {
        // Podziel na grupy (4 drużyny w każdej grupie)
        const groups = [];
        const groupCount = Math.ceil(teams.length / 4);
        const shuffledTeams = [...teams].sort(() => 0.5 - Math.random());
        
        // Utwórz grupy
        for (let i = 0; i < groupCount; i++) {
            groups.push(shuffledTeams.slice(i * 4, (i + 1) * 4));
        }
        
        // Wyświetl fazę grupową
        const groupStageDiv = document.createElement('div');
        groupStageDiv.className = 'group-stage';
        
        const groupStageTitle = document.createElement('h2');
        groupStageTitle.textContent = 'Faza grupowa';
        groupStageDiv.appendChild(groupStageTitle);
        
        groups.forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group';
            
            const groupTitle = document.createElement('h3');
            groupTitle.className = 'group-title';
            groupTitle.textContent = `Grupa ${String.fromCharCode(65 + index)}`;
            groupDiv.appendChild(groupTitle);
            
            // Tabela grupowa
            const standingsTable = document.createElement('table');
            standingsTable.className = 'standings';
            
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Pozycja</th>
                <th>Drużyna</th>
                <th>M</th>
                <th>W</th>
                <th>R</th>
                <th>P</th>
                <th>G+</th>
                <th>G-</th>
                <th>Pkt</th>
            `;
            standingsTable.appendChild(headerRow);
            
            // Symuluj wyniki meczów w grupie
            const teamsWithStats = group.map(team => ({
                ...team,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0
            }));
            
            // Rozegraj mecze każdy z każdym w grupie
            for (let i = 0; i < group.length; i++) {
                for (let j = i + 1; j < group.length; j++) {
                    const team1 = teamsWithStats[i];
                    const team2 = teamsWithStats[j];
                    
                    // Symuluj wynik meczu
                    const score1 = Math.floor(Math.random() * 5);
                    const score2 = Math.floor(Math.random() * 5);
                    
                    // Zaktualizuj statystyki
                    team1.played++;
                    team2.played++;
                    team1.goalsFor += score1;
                    team1.goalsAgainst += score2;
                    team2.goalsFor += score2;
                    team2.goalsAgainst += score1;
                    
                    if (score1 > score2) {
                        team1.wins++;
                        team1.points += 3;
                        team2.losses++;
                    } else if (score1 < score2) {
                        team2.wins++;
                        team2.points += 3;
                        team1.losses++;
                    } else {
                        team1.draws++;
                        team2.draws++;
                        team1.points++;
                        team2.points++;
                    }
                }
            }
            
            // Posortuj drużyny w grupie
            teamsWithStats.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if ((b.goalsFor - b.goalsAgainst) !== (a.goalsFor - a.goalsAgainst)) 
                    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                return b.goalsFor - a.goalsFor;
            });
            
            // Dodaj drużyny do tabeli
            teamsWithStats.forEach((team, position) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${position + 1}</td>
                    <td style="color: ${team.color}">${team.name}</td>
                    <td>${team.played}</td>
                    <td>${team.wins}</td>
                    <td>${team.draws}</td>
                    <td>${team.losses}</td>
                    <td>${team.goalsFor}</td>
                    <td>${team.goalsAgainst}</td>
                    <td><strong>${team.points}</strong></td>
                `;
                standingsTable.appendChild(row);
            });
            
            groupDiv.appendChild(standingsTable);
            groupStageDiv.appendChild(groupDiv);
        });
        
        tournamentView.appendChild(groupStageDiv);
        
        // Wygeneruj play-offy z najlepszymi drużynami z grup
        const playoffTeams = [];
        groups.forEach(group => {
            const teamsWithStats = group.map((team, index) => ({
                ...team,
                position: index + 1
            }));
            
            // Weź 2 najlepsze drużyny z każdej grupy
            playoffTeams.push(teamsWithStats[0]);
            if (groups.length <= 2) { // Jeśli jest mało grup, weź więcej drużyn
                playoffTeams.push(teamsWithStats[1]);
            }
        });
        
        // Jeśli liczba drużyn nie jest potęgą 2, dodaj "dzikie karty"
        let bracketSize = 2;
        while (bracketSize * 2 <= playoffTeams.length) {
            bracketSize *= 2;
        }
        
        // Wybierz najlepsze drużyny, aby uzyskać odpowiednią liczbę
        const sortedPlayoffTeams = [...playoffTeams].sort((a, b) => {
            // Sortuj według pozycji w grupie, potem punktów itd.
            if (a.position !== b.position) return a.position - b.position;
            return 0;
        }).slice(0, bracketSize);
        
        // Wygeneruj play-offy
        const playoffsTitle = document.createElement('h2');
        playoffsTitle.textContent = 'Faza pucharowa';
        tournamentView.appendChild(playoffsTitle);
        
        generatePlayoffBracket(sortedPlayoffTeams);
    }
    
    // Generowanie systemu ligowego (każdy z każdym)
    function generateLeagueTable(teams) {
        const leagueDiv = document.createElement('div');
        leagueDiv.className = 'league-stage';
        
        const leagueTitle = document.createElement('h2');
        leagueTitle.textContent = 'Tabela ligowa';
        leagueDiv.appendChild(leagueTitle);
        
        // Tabela ligowa
        const standingsTable = document.createElement('table');
        standingsTable.className = 'standings';
        
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Pozycja</th>
            <th>Drużyna</th>
            <th>M</th>
            <th>W</th>
            <th>R</th>
            <th>P</th>
            <th>G+</th>
            <th>G-</th>
            <th>Pkt</th>
        `;
        standingsTable.appendChild(headerRow);
        
        // Symuluj statystyki drużyn
        const teamsWithStats = teams.map(team => ({
            ...team,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        }));
        
        // Rozegraj mecze każdy z każdym
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                const team1 = teamsWithStats[i];
                const team2 = teamsWithStats[j];
                
                // Symuluj wynik meczu
                const score1 = Math.floor(Math.random() * 5);
                const score2 = Math.floor(Math.random() * 5);
                
                // Zaktualizuj statystyki
                team1.played++;
                team2.played++;
                team1.goalsFor += score1;
                team1.goalsAgainst += score2;
                team2.goalsFor += score2;
                team2.goalsAgainst += score1;
                
                if (score1 > score2) {
                    team1.wins++;
                    team1.points += 3;
                    team2.losses++;
                } else if (score1 < score2) {
                    team2.wins++;
                    team2.points += 3;
                    team1.losses++;
                } else {
                    team1.draws++;
                    team2.draws++;
                    team1.points++;
                    team2.points++;
                }
            }
        }
        
        // Posortuj drużyny
        teamsWithStats.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if ((b.goalsFor - b.goalsAgainst) !== (a.goalsFor - a.goalsAgainst)) 
                return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
            return b.goalsFor - a.goalsFor;
        });
        
        // Dodaj drużyny do tabeli
        teamsWithStats.forEach((team, position) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${position + 1}</td>
                <td style="color: ${team.color}">${team.name}</td>
                <td>${team.played}</td>
                <td>${team.wins}</td>
                <td>${team.draws}</td>
                <td>${team.losses}</td>
                <td>${team.goalsFor}</td>
                <td>${team.goalsAgainst}</td>
                <td><strong>${team.points}</strong></td>
            `;
            standingsTable.appendChild(row);
        });
        
        leagueDiv.appendChild(standingsTable);
        tournamentView.appendChild(leagueDiv);
    }
    
    // Event listeners
    teamCountSelect.addEventListener('change', initializeTeams);
    randomTeamsBtn.addEventListener('click', randomizeTeams);
    generateBtn.addEventListener('click', generateTournament);
    
    // Inicjalizacja
    initializeTeams();
});