import { Outlet } from 'react-router-dom';
import Header from '../../components/common/client/Header';
import Footer from '../../components/common/client/Footer';

function LayoutClient() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default LayoutClient;