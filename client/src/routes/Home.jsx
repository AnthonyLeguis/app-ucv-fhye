import '../CSS/home.css'
const img1 = 'https://i.ibb.co/ZX2rRBc/vitral1.jpg';
const img2 = 'https://i.ibb.co/47fyqtD/fondo-UCV2.jpg';

export const Home = () => {
  return (
    <>
      <section className="container-fluid d-flex flex-column justify-content-between bg-primary-subtle ">
        <div className='row w-100'>
          <div className="col d-none">
            <div className="mark py-2">
              <p>
                Este es un cintillo informativo usando una alerta de Bootstrap.
              </p>
            </div>
          </div>
        </div>

        <div className="row my-4">
          {/*  1. Agrega un div con la clase "carousel-container"  */}

          <div className="col carousel-container shadow">
            <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner ">
                <div className="carousel-item active" data-bs-interval="10000">
                  <div className="carousel-caption d-md-block text-top blur_Efect">
                    <h5>Gestión de personal</h5>
                    <h6>Obtén información sobre tu estado administrativo dentro de la FHyE. <hr />La coordinación administrativa más cera de ti.
                    </h6>
                  </div>
                  <img src={img1} className="mx-auto" alt="Vitral fondo" />
                </div>
                <div className="carousel-item" data-bs-interval="10000">
                  <img src={img2} className="mx-auto" alt="Nubes de calder fondo" />
                  <div className="carousel-caption d-md-block text-top blur_Efect">
                    <h5>Ingresa al portal</h5>
                    <h6>Mantente al día con tu información administrativa</h6>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          {/* Cierra el div "carousel-container" */}
        </div>

      </section>

    </>
  )
}
