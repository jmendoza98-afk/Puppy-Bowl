const API_URL = 'https://your-api.com/puppies'; 
    let state = {
      puppies: [],
      selectedPuppy: null
    };

    async function fetchAllPuppies() {
      const res = await fetch(API_URL);
      const data = await res.json();
      state.puppies = data;
      renderRoster();
    }

    async function fetchSinglePuppy(id) {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      state.selectedPuppy = data;
      renderPuppyDetails();
    }

    async function createNewPuppy(puppy) {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(puppy)
      });
      const newPuppy = await res.json();
      state.puppies.push(newPuppy);
      renderRoster();
    }

    async function removePuppy(id) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      state.puppies = state.puppies.filter(p => p.id !== id);
      renderRoster();
      document.getElementById('details').innerHTML = '<h2>Puppy details</h2>';
    }

    function renderRoster() {
      const rosterDiv = document.getElementById('roster');
      rosterDiv.innerHTML = '<h2>Roster</h2>';
      state.puppies.forEach(puppy => {
        const div = document.createElement('div');
        div.textContent = puppy.name;
        div.onclick = () => fetchSinglePuppy(puppy.id);
        rosterDiv.appendChild(div);
      });
    }

    function renderPuppyDetails() {
      const detailDiv = document.getElementById('details');
      const p = state.selectedPuppy;
      detailDiv.innerHTML = `
        <h2>Puppy details</h2>
        <img src="${p.imageUrl}" alt="${p.name}" />
        <p><strong>Name</strong>: ${p.name}</p>
        <p><strong>ID</strong>: ${p.id}</p>
        <p><strong>Breed</strong>: ${p.breed}</p>
        <p><strong>Team</strong>: ${p.team}</p>
        <p><strong>Status</strong>: ${p.status}</p>
        <button onclick="removePuppy(${p.id})">Remove from roster</button>
      `;
    }

    document.getElementById('newPuppyForm').onsubmit = async function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const puppy = Object.fromEntries(formData.entries());
      await createNewPuppy(puppy);
      e.target.reset();
    };

    fetchAllPuppies();