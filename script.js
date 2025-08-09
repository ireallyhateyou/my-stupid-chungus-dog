// Parallax / perspective text
const text = document.getElementById('perspectiveText');
const perspectiveSection = document.querySelector('.perspective-section');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastMove = 0;
function throttled(fn, limitMs) {
  return function (...args) {
    const now = performance.now();
    if (now - lastMove >= limitMs) {
      lastMove = now;
      fn.apply(this, args);
    }
  };
}

if (!prefersReducedMotion && perspectiveSection) {
  perspectiveSection.addEventListener(
    'mousemove',
    throttled((e) => {
      const rect = perspectiveSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      const rotateY = (mouseX / (rect.width / 2)) * 25;
      const rotateX = -(mouseY / (rect.height / 2)) * 25;
      const translateX = (mouseX / (rect.width / 2)) * 20;
      const translateY = (mouseY / (rect.height / 2)) * 20;
      text.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px) translateZ(0)`;
    }, 40)
  );

  perspectiveSection.addEventListener('mouseleave', () => {
    text.style.transform = 'rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0) scale(1)';
  });

  perspectiveSection.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = perspectiveSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const touchX = touch.clientX - centerX;
      const touchY = touch.clientY - centerY;
      const rotateY = (touchX / (rect.width / 2)) * 25;
      const rotateX = -(touchY / (rect.height / 2)) * 25;
      const translateX = (touchX / (rect.width / 2)) * 20;
      const translateY = (touchY / (rect.height / 2)) * 20;
      text.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px) translateZ(0)`;
    },
    { passive: false }
  );
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Age guessing game
let currentPictureIndex = 0;
const pictures = [
  { src: 'assets/doglove.jpg', correctAge: '6', correctText: '6 months and 9 days' },
  { src: 'assets/doglook.jpg', correctAge: '11', correctText: '11 months and 7 days' },
  { src: 'assets/dogdrink.jpg', correctAge: '15', correctText: '1 year and 3 months' }
];

function changePicture() {
  currentPictureIndex = (currentPictureIndex + 1) % pictures.length;
  const image = document.getElementById('age-guess-image');
  image.src = pictures[currentPictureIndex].src;
  updateAgeOptions();
  document.querySelectorAll('.age-option').forEach((option) => {
    option.classList.remove('correct', 'wrong');
    option.disabled = false;
  });
}

function updateAgeOptions() {
  const ageOptionsContainer = document.querySelector('.age-options');
  const currentPicture = pictures[currentPictureIndex];
  ageOptionsContainer.innerHTML = '';

  const wrongChoices = [
    { age: '1', text: '1 month' },
    { age: '2', text: '2 months' },
    { age: '12', text: '1 year' },
    { age: '120', text: '10 years' }
  ];

  const allOptions = [];
  const correctOption = document.createElement('button');
  correctOption.type = 'button';
  correctOption.className = 'age-option';
  correctOption.setAttribute('data-age', currentPicture.correctAge);
  correctOption.textContent = currentPicture.correctText;
  allOptions.push(correctOption);

  wrongChoices.forEach((choice) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'age-option';
    option.setAttribute('data-age', choice.age);
    option.textContent = choice.text;
    allOptions.push(option);
  });

  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  allOptions.forEach((o) => ageOptionsContainer.appendChild(o));
}

const ageOptionsContainerEl = document.querySelector('.age-options');
ageOptionsContainerEl.addEventListener('click', (e) => {
  const option = e.target.closest('.age-option');
  if (!option) return;
  handleAgeOptionSelection(option);
});
ageOptionsContainerEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const option = e.target.closest('.age-option');
    if (!option) return;
    e.preventDefault();
    handleAgeOptionSelection(option);
  }
});

function handleAgeOptionSelection(optionEl) {
  const selectedAge = optionEl.getAttribute('data-age');
  const isCorrect = selectedAge === pictures[currentPictureIndex].correctAge;
  if (isCorrect) {
    optionEl.classList.add('correct');
    createConfetti();
    showModal('Good job!', 'You must be a genius!');
  } else {
    optionEl.classList.add('wrong');
    showModal('Wrong!', 'Come on bruh.');
  }
  document.querySelectorAll('.age-option').forEach((opt) => (opt.disabled = true));
}

// Initialize
updateAgeOptions();

function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => {
      if (confetti.parentNode) confetti.remove();
    }, 5000);
  }
}

function showModal(title, text) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-text').textContent = text;
  document.getElementById('age-modal').classList.add('show');
}

function closeModal() {
  document.getElementById('age-modal').classList.remove('show');
  const correctOption = document.querySelector('.age-option.correct');
  if (correctOption) {
    setTimeout(() => changePicture(), 300);
  }
}

document.getElementById('age-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Contact captcha (extracted minimal functionality)
const contactCheckboxWindow = document.getElementById('contact-checkbox-window');
const contactCheckboxBtn = document.getElementById('contact-checkbox');
const contactSpinner = document.getElementById('contact-spinner');
const contactVerifyWindow = document.getElementById('contact-verify-window');
const contactVerifyButton = document.getElementById('contact-verify-button');
let contactSelectedImages = new Set();
let contactCaptchaPassed = false;

const contactDogImages = ['assets/pako1.JPG', 'assets/pako2.JPG', 'assets/pako3.JPG', 'assets/pako4.JPG', 'assets/pako5.JPG', 'assets/pako6.JPG'];
const contactNonDogImages = [
  'https://picsum.photos/300/300?random=1',
  'https://picsum.photos/300/300?random=2',
  'https://picsum.photos/300/300?random=3',
  'https://picsum.photos/300/300?random=4',
  'https://picsum.photos/300/300?random=5',
  'https://picsum.photos/300/300?random=6'
];

function contactShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function contactRegenerateImages() {
  const shuffledDogs = contactShuffle([...contactDogImages]).slice(0, 3);
  const shuffledNon = contactShuffle([...contactNonDogImages]).slice(0, 6);
  const all = contactShuffle([...shuffledDogs, ...shuffledNon]);
  document.querySelectorAll('.contact-captcha-img').forEach((img, idx) => {
    const container = img.parentElement;
    img.src = all[idx];
    img.classList.remove('selected');
    container.classList.remove('selected');
    img.onclick = () => contactToggleImageSelection(img, idx);
  });
  contactSelectedImages.clear();
  contactUpdateVerifyButton();
}

function contactToggleImageSelection(img, idx) {
  const container = img.parentElement;
  if (contactSelectedImages.has(idx)) {
    contactSelectedImages.delete(idx);
    img.classList.remove('selected');
    container.classList.remove('selected');
  } else {
    contactSelectedImages.add(idx);
    img.classList.add('selected');
    container.classList.add('selected');
  }
  contactUpdateVerifyButton();
}

function contactUpdateVerifyButton() {
  if (contactSelectedImages.size > 0) {
    contactVerifyButton.disabled = false;
    contactVerifyButton.onclick = contactVerifySelection;
  } else {
    contactVerifyButton.disabled = true;
    contactVerifyButton.onclick = null;
  }
}

function contactShowSpinner() {
  contactSpinner.style.visibility = 'visible';
  contactSpinner.style.opacity = '1';
  contactSpinner.style.animation = 'contact-spin 1s linear infinite';
}
function contactHideSpinner() {
  contactSpinner.style.opacity = '0';
  contactSpinner.style.animation = 'none';
  setTimeout(() => {
    contactSpinner.style.visibility = 'hidden';
  }, 300);
}

function contactHideCheckbox() {
  contactCheckboxBtn.style.width = '4px';
  contactCheckboxBtn.style.height = '4px';
  contactCheckboxBtn.style.borderRadius = '50%';
  contactCheckboxBtn.style.marginLeft = '25px';
  contactCheckboxBtn.style.marginTop = '33px';
  contactCheckboxBtn.style.opacity = '0';
}
function contactShowCheckbox() {
  contactCheckboxBtn.style.width = '100%';
  contactCheckboxBtn.style.height = '100%';
  contactCheckboxBtn.style.borderRadius = '2px';
  contactCheckboxBtn.style.margin = '21px 0 0 12px';
  contactCheckboxBtn.style.opacity = '1';
}

function contactShowVerifyWindow() {
  contactVerifyWindow.style.display = 'block';
  contactVerifyWindow.style.visibility = 'visible';
  contactVerifyWindow.style.opacity = '1';
  const rect = contactCheckboxWindow.getBoundingClientRect();
  contactVerifyWindow.style.top = contactCheckboxWindow.offsetTop - 80 + 'px';
  contactVerifyWindow.style.left = contactCheckboxWindow.offsetLeft + 54 + 'px';
}
function contactCloseVerifyWindow() {
  contactVerifyWindow.style.display = 'none';
  contactVerifyWindow.style.visibility = 'hidden';
  contactVerifyWindow.style.opacity = '0';
  contactShowCheckbox();
  contactHideSpinner();
  contactCheckboxBtn.disabled = false;
}

function contactVerifySelection() {
  const selectedIdx = Array.from(contactSelectedImages);
  const dogIdx = [];
  document.querySelectorAll('.contact-captcha-img').forEach((img, idx) => {
    const src = img.src;
    if (contactDogImages.some((p) => src.includes(p))) {
      dogIdx.push(idx);
    }
  });
  const allDogsSelected = dogIdx.every((i) => selectedIdx.includes(i));
  const noNonDogs = selectedIdx.every((i) => dogIdx.includes(i));
  if (allDogsSelected && noNonDogs) {
    contactCaptchaPassed = true;
    contactCloseVerifyWindow();
    alert('my dog is currently busy chewing toys... please hit it up later');
  } else {
    contactRegenerateImages();
  }
}

if (contactCheckboxBtn) {
  document.addEventListener('click', (evt) => {
    const path = evt.composedPath ? evt.composedPath() : [];
    if (contactVerifyWindow.style.display === 'block' && !path.includes(contactVerifyWindow)) {
      contactCloseVerifyWindow();
    }
  });
  contactCheckboxBtn.addEventListener('click', (e) => {
    e.preventDefault();
    contactCheckboxBtn.disabled = true;
    contactRegenerateImages();
    contactHideCheckbox();
    setTimeout(() => contactShowSpinner(), 200);
    setTimeout(() => contactShowVerifyWindow(), 600);
  });
}


