import '../CSS/dasboard.css'
import Example from '../hooks/DasboardGraphics'

export const Dashboard = () => {
  return (
    <>
      <div className='container-fluid contain overflow-auto'>
        <div className='row flex-column'>
          <div className="col mt-4 mb-2 rounded-1 col-md-8 mx-auto d-flex flex-row justify-content-center justify-content-md-right">
            <h1 className='TitleName text-center text-center m-0'>Tabla de datos</h1>
          </div>
        </div>
        <div className='row h-100 flex'>
          <div className='col col-md-3'>
          <Example />
          </div>
          <div className='col col-md-3'>
          <Example />
          </div>

          <div className='col col-md-3'>
          <Example />
          </div>

          <div className='col col-md-3'>
          <Example />
          </div>
        </div>

        <div className='row h-100 flex'>
          <div className='col col-md-3'>
          <Example />
          </div>
          <div className='col col-md-3'>
          <Example />
          </div>

          <div className='col col-md-3'>
          <Example />
          </div>

          <div className='col col-md-3'>
          <Example />
          </div>
        </div>
      </div>
    </>
  )
}
