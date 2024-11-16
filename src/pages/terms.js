import Head from 'next/head';
import React from "react";

const TermsPage = () => {
	return (
		<>
			<Head>
				<title>TimeBank - Terms and Conditions</title>
				<meta name="description" content="TimeBank Terms of Service." />
			</Head>
			<div className="container mx-auto p-6 mt-16" style={{ color: '#001F3F' }}>
				<h1 className="text-4xl font-bold text-center mb-8">Terms and Conditions</h1>

				<div className="text-lg leading-8">
					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
						<p>
							Welcome to TimeBank! These terms and conditions outline the rules and
							regulations for using our platform. By accessing or using TimeBank, we
							assume you accept these terms and conditions in full. If you do not agree
							with these terms, please discontinue using TimeBank.
						</p>
					</section>

					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">2. Intellectual Property Rights</h2>
						<p>
							Unless otherwise stated, TimeBank and/or its licensors own the
							intellectual property rights for all material on TimeBank. All
							rights are reserved. You may view and/or print pages from TimeBank for
							your personal use, subject to restrictions outlined in these terms.
						</p>
					</section>

					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">3. User Content</h2>
						<p>
							In these terms and conditions, &quot;Your Content&quot; refers to any audio, video,
							text, images, or other material you choose to share or upload on TimeBank.
							By sharing Your Content, you grant TimeBank a non-exclusive, worldwide,
							irrevocable, sublicensable license to use, reproduce, adapt, publish,
							translate, and distribute it across any media.
						</p>
					</section>

					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">4. Restrictions</h2>
						<p>You are specifically restricted from the following actions:</p>
						<ul className="list-disc ml-6">
							<li>
								Publishing any platform material in other media without prior
								permission.
							</li>
							<li>
								Selling, sublicensing, or otherwise commercializing any platform material.
							</li>
							<li>
								Using TimeBank in a way that could damage the platform or its reputation.
							</li>
							<li>
								Using TimeBank in violation of applicable laws and regulations.
							</li>
						</ul>
					</section>

					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
						<p>
							TimeBank and its team will not be held liable for any damages arising from
							or related to your use of our platform. This includes indirect,
							consequential, or special damages.
						</p>
					</section>

					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">6. Governing Law & Jurisdiction</h2>
						<p>
							These terms will be governed and interpreted according to the laws of the
							Province of Ontario. By using TimeBank, you agree to submit to the
							jurisdiction of the courts in Ontario for resolving disputes.
						</p>
					</section>

					<section className="mb-6">
						<h2 className="text-2xl font-semibold mb-2">7. Modifications to Terms</h2>
						<p>
							TimeBank reserves the right to modify these terms at any time. Changes
							will be effective immediately upon being posted. We encourage users to
							regularly review this page for updates.
						</p>
					</section>
				</div>
			</div>
		</>
	);
};

export default TermsPage;
