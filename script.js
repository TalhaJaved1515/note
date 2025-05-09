 // DOM Elements
 const addNoteBtn = document.getElementById('addNoteBtn');
 const notesContainer = document.getElementById('notesContainer');
 const noteModal = document.getElementById('noteModal');
 const modalTitle = document.getElementById('modalTitle');
 const noteForm = document.getElementById('noteForm');
 const noteId = document.getElementById('noteId');
 const noteTitle = document.getElementById('noteTitle');
 const noteContent = document.getElementById('noteContent');
 const closeModal = document.getElementById('closeModal');
 const cancelNote = document.getElementById('cancelNote');

if (confirm("You Can Save Your Note on This Devioand Application")) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

 // Event Listeners
 addNoteBtn.addEventListener('click', () => openModal());
 closeModal.addEventListener('click', () => closeModalWindow());
 cancelNote.addEventListener('click', () => closeModalWindow());
 noteForm.addEventListener('submit', handleNoteSubmit);

 // Functions
 function openModal(note = null) {
     if (note) {
         noteId.value = note.id;
         noteTitle.value = note.title;
         noteContent.value = note.content;
         modalTitle.textContent = 'Edit Note';
         modalTitle.style.color = '#2f45ff';
     } else {
         noteId.value = '';
         noteTitle.value = '';
         noteContent.value = '';
         modalTitle.textContent = 'Add New Note';
     }
     noteModal.classList.remove('hidden');
     setTimeout(() => {
         noteTitle.focus();
     }, 100);
 }

 function closeModalWindow() {
     noteModal.classList.add('hidden');
     noteForm.reset();
 }

 function handleNoteSubmit(e) {
     e.preventDefault();

     const noteData = {
         id: noteId.value || Date.now().toString(),
         title: noteTitle.value,
         content: noteContent.value,
         date: new Date().toLocaleDateString()
     };

     if (noteId.value) {
         const index = notes.findIndex(note => note.id === noteId.value);
         notes[index] = noteData;
     } else {
         notes.push(noteData);
     }

     saveNotes();
     renderNotes();
     closeModalWindow();
 }
 function deleteNote(id) {
     if (confirm("Are you sure you want to delete this note?")) {

         notes = notes.filter(note => note.id !== id);
         saveNotes();
         renderNotes();
     }
 }


 function saveNotes() {

     localStorage.setItem('notes', JSON.stringify(notes));
 }


 function renderNotes() {
     notesContainer.innerHTML = '';
     notes.forEach((note, index) => {
         const noteCard = document.createElement('div');
         noteCard.className = 'bg-white rounded-lg shadow-md p-6 note-card';
         noteCard.style.borderRadius = '10px';
         noteCard.style.animationDelay = `${index * 0.1}s`;

         noteCard.innerHTML = `
             <div class="flex justify-between items-start mb-4 ">
                 <h3 class="text-responsive-sm font-semibold text-gray-800" id="note-title">${note.title}</h3>
                 <div class="flex space-x-3">
                     <button class="edit-btn bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full p-2 transition-all duration-200" 
                             data-id="${note.id}"
                             title="Edit Note">
                         <i class="fas fa-edit" id="edit-icon"></i>
                     </button>
                     <button class="delete-btn bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-2  transition-all duration-200" 
                             data-id="${note.id}"
                             title="Delete Note"
                             style="margin-left: 0px;">
                         <i class="fas fa-trash" id="delete-icon"></i>
                     </button>
                 </div>
             </div>
             <p class="text-gray-600 mb-4 text-responsive-sm">${note.content}</p>
             <div class="text-sm text-gray-500 mt-6">${note.date}</div>
         `;

         notesContainer.appendChild(noteCard);
     });

     // Add event listeners to all edit and delete buttons
     document.querySelectorAll('.edit-btn').forEach(button => {
         button.addEventListener('click', (e) => {
             const selectedNoteId = e.currentTarget.getAttribute('data-id');
             const note = notes.find(note => note.id === selectedNoteId);
             if (note) {
                 openModal(note);
             }
         });
     });

     document.querySelectorAll('.delete-btn').forEach(button => {
         button.addEventListener('click', (e) => {
             const selectedNoteId = e.currentTarget.getAttribute('data-id');
             deleteNote(selectedNoteId);
         });
     });
 }

 // Keyboard Accessibility
 document.addEventListener('keydown', function (event) {
     if (event.key === 'Escape') {
         if (!noteModal.classList.contains('hidden')) {
             closeModalWindow();
         }
     }
 });

 // Make modal more accessible
 noteModal.addEventListener('keydown', function (event) {
     if (event.key === 'Escape') {
         closeModalWindow();
     }
 });

 // Initial render
 renderNotes();

 document.addEventListener('keydown', function (event) {
     if (event.ctrlKey && event.key === 'a') {
         openModal();
         event.preventDefault();
     }
 });
 // reset local storage onclick Ctrl+d and reset the page
 document.addEventListener('keydown', function (event) {

     if (event.ctrlKey && event.key === 'x') {
         if (confirm('Are you sure you want to delete all notes?')) {
             localStorage.clear();
             location.reload();
             window.location.reload();

             window.location.reload(true);

         }

     }
     else {
         console.log('Reset cancelled by user');
     }

 })

 // Search functionality
 const searchInput = document.getElementById('searchInput');
 const clearSearch = document.getElementById('clearSearch');

 searchInput.addEventListener('input', function () {
     const searchTerm = this.value.toLowerCase();
     const filteredNotes = notes.filter(note =>
         note.title.toLowerCase().includes(searchTerm) ||
         note.content.toLowerCase().includes(searchTerm)
     );

     // Show/hide clear button based on search term
     if (searchTerm.length > 0) {
         clearSearch.style.opacity = '1';
     } else {
         clearSearch.style.opacity = '0.5';
     }

     // Render filtered notes
     renderFilteredNotes(filteredNotes);
 });

 clearSearch.addEventListener('click', function () {
     searchInput.value = '';
     clearSearch.style.opacity = '0.7';
     renderNotes();
 });

 // Initial state
 clearSearch.style.opacity = '0.7';

 function renderFilteredNotes(filteredNotes) {
     notesContainer.innerHTML = '';
     filteredNotes.forEach((note, index) => {
         const noteCard = document.createElement('div');
         noteCard.className = 'bg-white rounded-lg shadow-md p-6 note-card';
         noteCard.style.animationDelay = `${index * 0.1}s`;

         noteCard.innerHTML = `
             <div class="flex justify-between items-start mb-4">
                 <h3 class="text-responsive-sm font-semibold text-gray-800" id="note-title">${note.title}</h3>
                 <div class="flex space-x-3">
                     <button class="edit-btn bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full p-2 transition-all duration-200" 
                             data-id="${note.id}"
                             title="Edit Note">
                         <i class="fas fa-edit" id="edit-icon"></i>
                     </button>
                     <button class="delete-btn bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-2 transition-all duration-200" 
                             data-id="${note.id}"
                             title="Delete Note"
                             style="margin-left: 0px;">
                         <i class="fas fa-trash" id="delete-icon"></i>
                     </button>
                 </div>
             </div>
             <p class="text-gray-600 mb-4 text-responsive-sm">${note.content}</p>
             <div class="text-sm text-gray-500 mt-6">${note.date}</div>
         `;

         notesContainer.appendChild(noteCard);
     });

     // Add event listeners to filtered notes
     document.querySelectorAll('.edit-btn').forEach(button => {
         button.addEventListener('click', (e) => {
             const selectedNoteId = e.currentTarget.getAttribute('data-id');
             const note = notes.find(note => note.id === selectedNoteId);
             if (note) {
                 openModal(note);
             }
         });
     });

     document.querySelectorAll('.delete-btn').forEach(button => {
         button.addEventListener('click', (e) => {
             const selectedNoteId = e.currentTarget.getAttribute('data-id');
             deleteNote(selectedNoteId);
         });
     });
 }
 //accissibility options
 // 1:Ctrl+a is used for add notes.
 // 2:Ctrl+x is used for reset page.
 // 3:Esc is used Escape.
 // 4:Ctrl+q is used for usage information.

 // Usage Information Modal
 const usageInfoBtn = document.getElementById('usageInfoBtn');
 const usageInfoModal = document.getElementById('usageInfoModal');
 const closeUsageInfo = document.getElementById('closeUsageInfo');

 usageInfoBtn.addEventListener('click', () => {
     usageInfoModal.classList.remove('hidden');
 });

 closeUsageInfo.addEventListener('click', () => {
     usageInfoModal.classList.add('hidden');
 });

 // Close modal when clicking outside
 usageInfoModal.addEventListener('click', (e) => {
     if (e.target === usageInfoModal) {
         usageInfoModal.classList.add('hidden');
     }
 });

 // Close modal with Escape key
 document.addEventListener('keydown', (e) => {
     if (e.key === 'Escape' && !usageInfoModal.classList.contains('hidden')) {
         usageInfoModal.classList.add('hidden');
     }
 });
 document.addEventListener('keydown', function (event) {
     if (event.ctrlKey && event.key === 'q') {
         usageInfoModal.classList.remove('hidden');
     }
 })

}
else{
    console.log('Canceled')
}
 // Notes array to store notes
 