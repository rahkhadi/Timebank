import Head from 'next/head';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../../src/styles/About.module.css";

const AboutPage = () => {
	return (
		<>
			<Head>
				<title>TimeBank - About Us</title>
				<meta name="description" content="Learn more about TimeBank's mission and creators." />
			</Head>
			<div className="container mx-auto mt-16 px-4">
				<h1 className="text-4xl font-bold text-center text-[#1f2937] p-10 mb-8">
					About TimeBank
				</h1>

				<section className="mb-12">
					<p className="text-lg text-[#4a5568] mb-6 leading-7">
						Welcome to <strong><i>TimeBank</i></strong>, a platform dedicated to empowering communities by enabling them to exchange time and skills. 
						Here at TimeBank, we believe everyone has something valuable to contribute, and our goal is to create a collaborative environment where time is the most valuable currency.
					</p>
					<p className="text-lg text-[#4a5568] mb-6 leading-7">
						Have questions or need support? Feel free to reach out to us at:
						<Link
							href="mailto:rahimkhadimhussain219@gmail.com"
							target="_blank"
							className="text-blue-600 underline ml-1">
							rahimkhadimhussain219@gmail.com
						</Link>.
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-bold text-[#1f2937] mb-6">Our Mission</h2>
					<p className="text-lg text-[#4a5568] mb-6 leading-7">
						TimeBank aims to foster collaboration and trust within communities by creating a platform where people can help each other and earn <strong>TimeCoins</strong>. Whether it's tutoring, cooking, or fixing something, your time and skills can make a difference!
					</p>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-bold text-[#1f2937] mb-6">Meet the Creator</h2>
					<div className={`${styles.teamCard} bg-white p-6 rounded-lg shadow-md`}>
						<div className="text-center">
							<h3 className="text-xl font-semibold text-[#1f2937]">Rahimullah Khadim Hussain</h3>
							<p className="text-gray-600 mt-1 mb-4">Full Stack Web Developer</p>
						</div>
						<div className="flex justify-center space-x-4">
							<Link
								href="https://github.com/rahkhadi"
								target="_blank"
								rel="noopener noreferrer">
								<Image
									src="/github-icon.svg"
									width={30}
									height={30}
									alt="GitHub Icon"
									className={`${styles.socialCard}`}
								/>
							</Link>
							<Link
								href="https://www.linkedin.com/in/rahim-hussaini"
								target="_blank"
								rel="noopener noreferrer">
								<Image
									src="/linkedin-icon.svg"
									width={30}
									height={30}
									alt="LinkedIn Icon"
									className={`${styles.socialCard}`}
								/>
							</Link>
							<Link
								href="mailto:rahimkhadimhussain219@gmail.com"
								target="_blank"
								rel="noopener noreferrer">
								<Image
									src="/email-icon.svg"
									width={30}
									height={30}
									alt="Email Icon"
									className={`${styles.socialCard}`}
								/>
							</Link>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default AboutPage;
