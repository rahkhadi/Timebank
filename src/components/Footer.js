// components/Footer.js
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-600 text-white py-6 mt-20">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} Timebank. All Rights Reserved.
                </div>
                <div className="flex space-x-4">
                    <Link href="/about">
                        <span className="hover:underline cursor-pointer">About</span>
                    </Link>
                    
                    <Link href="/contact">
                        <span className="hover:underline cursor-pointer">Contact</span>
                    </Link>
                    
                    <Link href="/terms">
                        <span className="hover:underline cursor-pointer">Terms of Service</span>
                    </Link>
                </div>
            </div>
        </footer>
    );  
};

export default Footer;
