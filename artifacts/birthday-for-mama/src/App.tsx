import { useState } from 'react';

function FlowerIllustration() {
  return (
    <svg className="flower-art" viewBox="0 0 145 210" fill="none" aria-hidden="true">
      <path d="M74 204C74 164 76 122 84 78M74 155C55 137 39 132 24 132M78 123C101 106 113 92 121 74" stroke="#73866f" strokeWidth="2" strokeLinecap="round" />
      <path d="M71 163C53 143 44 145 31 148C43 163 53 169 71 163ZM81 131C95 113 107 111 120 111C111 126 98 135 81 131Z" fill="#a9bba2" stroke="#73866f" strokeWidth="1.5" />
      <path d="M82 81C70 69 66 57 77 49C85 55 88 65 82 81ZM83 79C81 63 86 50 100 51C104 63 97 75 83 79ZM82 79C94 66 107 64 114 74C108 86 97 89 82 79ZM82 79C96 82 104 94 97 104C84 103 78 93 82 79ZM82 79C74 94 61 99 52 90C57 78 68 74 82 79ZM82 79C66 74 59 62 67 52C79 55 85 66 82 79Z" fill="#d9a47e" stroke="#a86e59" strokeWidth="1.5" />
      <circle cx="82" cy="79" r="8" fill="#e6ca8f" stroke="#a86e59" strokeWidth="1.5" />
      <path d="M26 132C16 122 12 112 19 104C28 108 31 118 26 132ZM26 132C31 121 40 117 47 123C44 132 36 136 26 132Z" fill="#e8c894" stroke="#a86e59" strokeWidth="1.3" />
    </svg>
  );
}

function Envelope({ opened, onOpen }: { opened: boolean; onOpen: () => void }) {
  return (
    <button
      className={`envelope-button${opened ? ' is-open' : ''}`}
      type="button"
      aria-label={opened ? 'Surat sudah terbuka' : 'Buka amplop kejutan untuk Mama'}
      aria-pressed={opened}
      onClick={onOpen}
    >
      <span className="letter-peek" aria-hidden="true">Untuk Mama,</span>
      <span className="envelope" aria-hidden="true">
        <span className="envelope-flap" />
        <span className="envelope-seal">M</span>
      </span>
    </button>
  );
}

function App() {
  const [opened, setOpened] = useState(false);

  const openSurprise = () => {
    setOpened(true);
    window.setTimeout(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('surat')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
    }, 280);
  };

  return (
    <main className="birthday-page">
      <div className="page-frame">
        <header className="masthead">
          <div className="wordmark"><span className="wordmark-mark">M</span><span>Untuk Mama</span></div>
          <span className="top-note">dibuat dengan segenap hati</span>
        </header>
        <section className="intro" aria-labelledby="intro-heading">
          <div className="intro-copy">
            <div className="eyebrow">Hari istimewa, untuk orang paling istimewa</div>
            <h1 id="intro-heading">Selamat<br /><span>ulang tahun,</span>Mama.</h1>
            <p>Hari ini, biar Mama yang menerima sedikit dari semua kasih yang selama ini Mama berikan.</p>
            <button className="open-button" type="button" onClick={openSurprise}>
              Buka kejutan kecil
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true"><path d="M1 6h15m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="intro-signoff">Dari anakmu, dengan cinta.</span>
          </div>
          <div className="gift-scene" aria-label="Sebuah surat kecil yang menunggu dibuka">
            <span className="gift-halo" aria-hidden="true" />
            <span className="gift-sun" aria-hidden="true" />
            <span className="tiny-star star-one" aria-hidden="true">✳</span>
            <span className="tiny-star star-two" aria-hidden="true">✳</span>
            <FlowerIllustration />
            <Envelope opened={opened} onOpen={openSurprise} />
            <span className="gift-caption">ada yang ingin kusampaikan</span>
          </div>
        </section>
      </div>

      <div className={`hidden-content${opened ? ' is-visible' : ''}`} aria-hidden={!opened}>
        <div className="section-divider" aria-hidden="true">✳</div>
        <section className="letter-section" id="surat" aria-labelledby="letter-heading">
          <div className="letter-card">
            <div className="letter-topline"><span>Sepucuk surat kecil</span><span className="letter-date">hari ini, untuk Mama</span></div>
            <h2 id="letter-heading">Untuk Mama<br /><em>tersayang,</em></h2>
            <div className="letter-body">
              <p>Selamat ulang tahun, Ma.</p>
              <p>Terima kasih karena selalu tahu kapan aku butuh dipeluk, bahkan sebelum aku sempat bilang apa-apa. Terima kasih untuk rumah yang terasa hangat, untuk doa yang diam-diam Mama titipkan, dan untuk semua hal kecil yang ternyata berarti begitu besar.</p>
              <p>Aku mungkin belum selalu pandai mengatakannya, tapi aku bersyukur sekali menjadi anak Mama. Semoga hari ini Mama merasa dicintai—sebesar cinta yang selalu Mama berikan kepadaku.</p>
              <p>Semoga tahun ini membawa lebih banyak pagi yang tenang, tawa yang panjang, makanan kesukaan, dan waktu untuk melakukan hal-hal yang Mama suka.</p>
            </div>
            <div className="letter-signoff"><span>Dengan cinta, selalu</span><strong>anakmu</strong></div>
          </div>
        </section>

        <section className="memory-section" aria-labelledby="memory-heading">
          <div className="page-frame memory-inner">
            <span className="small-label">Hal-hal kecil yang selalu kuingat</span>
            <div className="memory-title">
              <h2 id="memory-heading">Rasanya seperti<br />pulang.</h2>
              <p>Kalau ditanya apa arti rumah, mungkin jawabannya selalu Mama.</p>
            </div>
            <div className="memory-grid">
              <article className="memory-note"><span className="note-index">01 / masakan</span><span className="memory-spark">✳</span><h3 className="note-title">Masakan yang selalu Mama siapkan</h3><p>Masakan yang selalu Mama sediakan membuatku merasa dirawat, bahkan lewat hal-hal kecil setiap hari.</p></article>
              <article className="memory-note"><span className="note-index">02 / perjalanan</span><span className="memory-spark">✳</span><h3 className="note-title">Kenangan setiap kali jalan-jalan</h3><p>Setiap kali kita jalan-jalan, kebersamaan sederhana itu selalu jadi kenangan yang kusimpan.</p></article>
              <article className="memory-note"><span className="note-index">03 / sekolah</span><span className="memory-spark">✳</span><h3 className="note-title">Selalu membantu sampai akhir</h3><p>Walau dulu aku sering menunda tugas-tugas sekolah sampai mepet dan belum bertanggung jawab, Mama tetap membantu serta menemaniku sampai semuanya selesai.</p></article>
            </div>
          </div>
        </section>

        <section className="wishes-section page-frame" aria-labelledby="wishes-heading">
          <span className="small-label">Doa kecil untuk Mama</span>
          <h2 id="wishes-heading">Semoga hari-hari Mama<br />selembut <em>hati Mama.</em></h2>
          <p className="wishes-copy">Sehat selalu, bahagia selalu, dan jangan lupa menyisakan sedikit waktu untuk diri Mama sendiri. Hari ini milik Mama.</p>
          <div className="wish-list" aria-label="Harapan untuk Mama">
            <span className="wish-pill">tubuh yang sehat</span>
            <span className="wish-pill">hati yang ringan</span>
            <span className="wish-pill">tawa setiap hari</span>
            <span className="wish-pill">banyak waktu bersama</span>
          </div>
        </section>
        <footer className="last-note">
          <p>Terima kasih sudah menjadi rumahku.</p>
          <span>Selamat ulang tahun, Mama. Aku sayang Mama.</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
