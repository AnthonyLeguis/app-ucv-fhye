import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export const useScreenTransition = () => {

  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId; // Variable para almacenar el ID del timeout

    if (isTransitioning && transitionRef.current) {
      transitionRef.current.classList.add('transitioning');

      timeoutId = setTimeout(() => {
        transitionRef.current.classList.remove('end');

        navigate(location.pathname);
        timeoutId = setTimeout(() => {
          setIsTransitioning(false);
          transitionRef.current.classList.remove('transitioning');
        }, 2500);
      }, 1500);
    } else if (transitionRef.current) {
      transitionRef.current.classList.remove('transitioning', 'end');
    }

    // Limpiar el timeout si el componente se desmonta o si isTransitioning cambia a false
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isTransitioning, navigate, location.pathname]);

  const startTransition = () => setIsTransitioning(true);

  return { startTransition, isTransitioning, transitionRef };
};
