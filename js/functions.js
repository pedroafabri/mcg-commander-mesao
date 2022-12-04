const ALPHABET = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const PARTICIPANTS_PER_GROUP = 3;

const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const getLetterByIndex = (index) => index > ALPHABET.length ? index : ALPHABET[index];

const drawGroups = (groups) => {
    const groupsContainer = document.querySelector('#groups-container');
    const container = document.querySelector('#groups-row');
    const groupTemplate = document.querySelector('#group-template');
    const groupParticipantTemplate = document.querySelector('#group-participant-template');

    container.innerHTML = "";

    for(const groupIndex in groups) {
        const card = groupTemplate.content.cloneNode(true);
        card.querySelector('.card-title').innerHTML = `Grupo ${getLetterByIndex(groupIndex)}`
        const participants = card.querySelector('.card-text');

        for(const participantIndex in groups[groupIndex]) {
            const participant = groupParticipantTemplate.content.cloneNode(true);
            const label = participant.querySelector('label');
            const input = participant.querySelector('input');
            const checkboxValue = groups[groupIndex][participantIndex];

            input.id = input.value = checkboxValue;
            label.setAttribute('for', checkboxValue);

            label.innerHTML = checkboxValue;
            participants.append(participant);
        }
        container.append(card);

        groupsContainer.hidden = false;
    }
}

const createGroupsFromEntries = entries => {
    const groupsCount = Math.floor(entries.length / PARTICIPANTS_PER_GROUP) || 1;
    const entriesCount = entries < PARTICIPANTS_PER_GROUP ? entries : PARTICIPANTS_PER_GROUP;
    const groups = [];

    for(let groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
      const newGroup = [];
      for(let i = 0; i < entriesCount; i++) { newGroup.push(entries.pop()) }
      groups.push(newGroup);
    }

    for (let extraEntryIndex in entries) {
      const groupIndex = extraEntryIndex % groups.length;
      groups[groupIndex].push(entries[extraEntryIndex]);
    }

    return groups;
}

const onEntriesSubmit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    if(!data.entries) { return alert("Preencha pelo menos um nome. "); }

    document.querySelector('#entries-container').hidden = true;
    const entries = shuffle(data.entries.split(/\r?\n/));
    
    const groups = createGroupsFromEntries(entries);

    drawGroups(groups);
}

const clearEvent = () => {
  document.querySelector('#groups-container').hidden = true;
  document.querySelector('#winner-container').hidden = true;
  document.querySelector('#entries-container').hidden = false;
  document.querySelector('#entries-form').reset();
}

const drawWinner = name => {
  const container = document.querySelector('#winner-container');
  container.querySelector('#winner-name').innerHTML = name;
  
  document.querySelector('#groups-container').hidden = true;
  container.hidden = false;

}

const nextRound = () => {
  const checked = Array.from(document.querySelectorAll('input:checked'));
  if(!checked.length) { return alert("Selecione pelo menos um vencedor."); }
  const names = checked.map(c => c.value);
  
  if(names.length === 1) { return drawWinner(names[0]); }
  drawGroups(createGroupsFromEntries(names));

}