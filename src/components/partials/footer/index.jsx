import React from "react";
import useFooterType from "@/hooks/useFooterType";

const Footer = ({ className = "custom-class" }) => {
	const [footerType] = useFooterType();
	const footerclassName = () => {
		switch (footerType) {
			case "sticky":
				return "sticky bottom-0 z-[999]";
			case "static":
				return "static";
			case "hidden":
				return "hidden";
		}
	};
	return (
		<footer className={className + " " + footerclassName()}>
			<div className="site-footer px-6 bg-[#067BBF] dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-white py-4">
				<div className="grid md:grid-cols-2 grid-cols-1 md:gap-5">
					<div
						className="text-center ltr:md:text-start rtl:md:text-right"
						style={{ fontSize: "11px" }}
					>
						COPYRIGHT &copy; 2025 TechServices
					</div>
					<div className="ltr:md:text-right rtl:md:text-end text-center text-sm"></div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
