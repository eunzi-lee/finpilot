import { useNavigate } from 'react-router'

function HeroSection() {
    const navigate = useNavigate()

    const handleStart = () => {
        navigate('/dashboard')
    }

    return (
        <section className="hero-section">
            <span className="service-badge">AI PERSONAL FINANCE</span>

            <h1 className="service-title">
                Fin<span>Pilot</span>
            </h1>

            <p className="service-description">
                소비를 기록하고 분석하여
                <br />
                더 나은 금융 습관을 만들어보세요.
            </p>

            <button
                type="button"
                className="start-button"
                onClick={handleStart}
            >
                금융 관리 시작하기
            </button>
        </section>
    )
}

export default HeroSection