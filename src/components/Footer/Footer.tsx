import './Footer.css';
import { Container } from '../Container/Container';

export const Footer = () => {
  return (
    <footer className="footer">
      <svg className="footer__wave" viewBox="0 0 1440 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M448 0C228.764 0 54.5 30.7284 0 44V128H1440V1.88947e-05C1412 7.64564 1257.54 43 993 43C728.461 43 667.236 0 448 0Z" fill="#1A2935"/>
      </svg>
      <Container>
        <div className="footer__content">
          <div className="footer__logo">
            <svg width="192" height="40" viewBox="0 0 192 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.4205 2.01261C21.638 1.22317 20.362 1.22317 19.5795 2.01261L9.28443 12.3996L3.42625 18.311C0.191007 21.5751 0.191007 26.8672 3.42625 30.1313C6.66149 33.3954 11.9068 33.3954 15.1421 30.1313L17.3056 27.9485L16.9404 25.7148L12.7662 26.4452C12.3663 26.5152 12 26.2075 12 25.8015C12 24.0954 12.8324 22.4966 14.2301 21.5183L16.0475 20.2461L15.7158 18.2143C15.2706 15.4875 16.264 12.724 18.3432 10.9047L19.683 9.73238C20.437 9.07258 21.563 9.07258 22.317 9.73238L23.6568 10.9047C25.7361 12.724 26.7294 15.4875 26.2842 18.2143L25.9525 20.2461L27.7699 21.5183C29.1676 22.4966 30 24.0954 30 25.8015C30 26.2075 29.6337 26.5152 29.2338 26.4452L25.0596 25.7148L24.7025 27.9023L26.8579 30.1303C30.0932 33.3944 35.3385 33.3944 38.5738 30.1303C41.809 26.8662 41.809 21.5741 38.5738 18.31L22.4205 2.01261ZM21 19.0793C22.3807 19.0793 23.5 17.96 23.5 16.5793C23.5 15.1986 22.3807 14.0793 21 14.0793C19.6193 14.0793 18.5 15.1986 18.5 16.5793C18.5 17.96 19.6193 19.0793 21 19.0793ZM29 37.0795C29 37.6423 28.814 38.1616 28.5002 38.5795H13.4998C13.186 38.1616 13 37.6423 13 37.0795C13 35.6988 14.1193 34.5795 15.5 34.5795C16.0756 34.5795 16.6058 34.774 17.0283 35.1009C17.2648 33.1174 18.9528 31.5795 21 31.5795C23.0472 31.5795 24.7352 33.1174 24.9717 35.1009C25.3942 34.774 25.9244 34.5795 26.5 34.5795C27.8807 34.5795 29 35.6988 29 37.0795Z" fill="white"/>
            </svg>
          </div>
          <div className="footer__sections">
            <div className="footer__section">
              <h4 className="footer__section-title">Product</h4>
              <ul className="footer__links">
                <li><a href="/new-game" className="footer__link">Start new game</a></li>
                <li><a href="/faqs" className="footer__link">FAQs</a></li>
                <li><a href="/pricing" className="footer__link">Pricing</a></li>
                <li><a href="/terms" className="footer__link">Terms</a></li>
              </ul>
            </div>
            <div className="footer__section">
              <h4 className="footer__section-title">Connect</h4>
              <ul className="footer__links">
                <li><a href="/contact" className="footer__link">Contact us</a></li>
                <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__link">LinkedIn</a></li>
                <li><a href="/what-is-planning-poker" className="footer__link">What is planning poker?</a></li>
              </ul>
            </div>
            <div className="footer__section">
              <h4 className="footer__section-title">Legal</h4>
              <ul className="footer__links">
                <li><a href="/security" className="footer__link">Security</a></li>
                <li><a href="/gdpr" className="footer__link">GDPR Compliant</a></li>
                <li><a href="/legal-notice" className="footer__link">Legal notice</a></li>
                <li><a href="/cookie-policy" className="footer__link">Cookie policy</a></li>
                <li><a href="/privacy-policy" className="footer__link">Privacy policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__copyright">
          <p>We Agile You ®</p>
        </div>
      </Container>
    </footer>
  );
};

