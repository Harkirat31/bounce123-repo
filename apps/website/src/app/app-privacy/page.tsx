import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6"
import FeatureBox from "../components/home/feature_box"
import FeatureBoxDetailed from "../components/home/feature_box_detailed"
import { map_view_list, mobile_app_list, route_drawing_list } from "../constants/home_constants"

const Home = () => {
    return (
        <div className="px-6 sm:pl-0 flex flex-col justify-start text-black">
            <h1 className="text-2xl font-bold mt-5">Privacy Policy</h1>
            <p>Effective Date: March 30, 2025</p>

            <p className="mt-5">
                This Privacy Policy explains how Deliveries For Driver, collects, uses, and protects the information related to the mobile application ("App"). By using the App, you agree to this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold mt-5">Information We Collect</h2>
            <p>We do not directly collect personal information through the mobile app. The email address and password you use to log in are provided by companies registered with us through a separate web application. These credentials may include personal email addresses collected by your company.</p>
            <h3 className="text-lg mt-2">Authentication and Communication Data:</h3>
            <ul className="list-disc">
                <li className="ml-5">Email Address: The email address provided by the company may be your personal or work email. It is used for:</li>
                <ul className="list-disc">
                    <li className="ml-10">To authenticate your login to the App</li>
                    <li className="ml-10">To send you information related to your deliveries, such as updates and notifications.</li>
                </ul>
                <li className="ml-5">Password: The password provided by the company is used solely for authentication purposes.</li>

            </ul>
            <p>We do not collect any additional personal data beyond what is required for these purposes.</p>


            <h2 className="text-xl font-semibold mt-5">How We Protect Your Information</h2>
            <p>We take the security of your login credentials and email usage seriously. All data is encrypted during transmission and securely managed.</p>
            <h3 className="text-lg mt-2">Security Measures:</h3>
            <ul className="list-disc">
                <li className="ml-5">Encryption: We use industry-standard encryption to protect your email and password during transmission and storage.</li>
                
                <li className="ml-5">Limited Access: Access to this information is restricted to authorized personnel and systems only.</li>

            </ul>
            <p>We do not collect any additional personal data beyond what is required for these purposes</p>


            <h2 className="text-xl font-semibold mt-5">Third-Party Services</h2>
            <p>We do not share your email, password, or any other data with third-party services. The email address is only used to communicate delivery-related information between us and you as part of your role.</p>

            
            <h2 className="text-xl font-semibold mt-5">Responsibilities of Registered Companies</h2>
            <p>The companies that register with us via our web application are responsible for providing their users (employees, drivers, etc.) with login credentials (email and password) and maintaining the accuracy of their users' details.</p>

            <h2 className="text-xl font-semibold mt-5">Your Responsibilities</h2>
            <p>As a user, it is your responsibility to keep your email and password secure. Please do not share your login credentials with anyone, and immediately report any suspicious activity or unauthorized access to us.</p>


            <h2 className="text-xl font-semibold mt-5">Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be communicated within the App, and the updated date will be noted at the top of this document. Continued use of the App after such updates will indicate your acceptance of the revised Privacy Policy.</p>
            

            <h2 className="text-xl font-semibold mt-5">Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at: info@easeyourtasks.com</p>
            
            
            
            
            
        </div>


    )
}

export default Home
