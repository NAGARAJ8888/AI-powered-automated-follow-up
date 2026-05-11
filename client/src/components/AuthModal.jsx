import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
// closeAllModals now exists in authSlice — setCurrentModalType is unused here
import { closeAllModals } from '../features/auth/authSlice';

const AuthModal = () => {
  // showRegisterModal and currentModalType now exist in authSlice
  const { showLoginModal, showRegisterModal, currentModalType } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const isOpen = showLoginModal || showRegisterModal;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeAllModals());
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, dispatch]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      dispatch(closeAllModals());
    }
  };

  const handleSuccess = () => {
    dispatch(closeAllModals());
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8 lg:p-12">
        {/* Render login or register form based on currentModalType */}
        {currentModalType === 'login'
          ? <LoginForm onSuccess={handleSuccess} />
          : <RegisterForm onSuccess={handleSuccess} />
        }
      </div>
    </div>
  );
};

export default AuthModal;
