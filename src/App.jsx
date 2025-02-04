import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Dashboard = lazy(() => import("./pages/dashboard"));

const CrmPage = lazy(() => import("./pages/dashboard/crm"));
const ProjectPage = lazy(() => import("./pages/dashboard/project"));
const BankingPage = lazy(() => import("./pages/dashboard/banking"));
const Proforma = lazy(() => import("./pages/dashboard/proforma.jsx"));
const Attliv = lazy(() => import("./pages/dashboard/Bonattlivr.jsx"));
const Attpay = lazy(() => import("./pages/dashboard/BonattPay.jsx"));
const Bonrefuse = lazy(() => import("./pages/dashboard/Bonrefuse.jsx"));
const Requete = lazy(() => import("./pages/dashboard/Requete.jsx"));
const Livraieffect = lazy(() => import("./pages/dashboard/Livraisoneff.jsx"));
const Reponserequete = lazy(() =>
	import("./pages/dashboard/Reponserequete.jsx")
);

const LoginGroupEntry = lazy(() => import("./pages/auth/LoginGroupEntry"));

const Modification = lazy(() =>
	import("./pages/table/react-tables/Modification.jsx")
);
const ModificationFacture = lazy(() =>
	import("./pages/dashboard/ModificationFacture.jsx")
);

const EditionFacture = lazy(() =>
	import("./pages/dashboard/EditionFacture.jsx")
);
const Paiement = lazy(() =>
	import("./pages/table/react-tables/FormulairePaiement.jsx")
);
const Visualisation = lazy(() =>
	import("./pages/dashboard/VisualisationFacture.jsx")
);
const Profilquincail =  lazy(() =>
	import("./pages/dashboard/profil.jsx")
);

const Login = lazy(() => import("./pages/auth/login"));
const Login2 = lazy(() => import("./pages/auth/login2"));
const Login3 = lazy(() => import("./pages/auth/login3"));
const Register = lazy(() => import("./pages/auth/register"));
const Register2 = lazy(() => import("./pages/auth/Register2"));
const Register3 = lazy(() => import("./pages/auth/Register3"));
const Register4 = lazy(() => import("./pages/auth/Register4"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const ForgotPass2 = lazy(() => import("./pages/auth/forgot-password2"));
const ForgotPass3 = lazy(() => import("./pages/auth/forgot-password3"));
const LockScreen = lazy(() => import("./pages/auth/lock-screen"));
const LockScreen2 = lazy(() => import("./pages/auth/lock-screen2"));
const LockScreen3 = lazy(() => import("./pages/auth/lock-screen3"));
const Error = lazy(() => import("./pages/404"));

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";

// components pages
const Button = lazy(() => import("./pages/components/button"));
const Dropdown = lazy(() => import("./pages/components/dropdown"));
const Badges = lazy(() => import("./pages/components/badges"));
const Colors = lazy(() => import("./pages/components/colors"));
const Typography = lazy(() => import("./pages/components/typography"));
const Alert = lazy(() => import("./pages/components/alert"));
const Progressbar = lazy(() => import("./pages/components/progress-bar"));
const Card = lazy(() => import("./pages/components/card"));
const Image = lazy(() => import("./pages/components/image"));
const Placeholder = lazy(() => import("./pages/components/placeholder"));
const Tooltip = lazy(() => import("./pages/components/tooltip-popover"));
const Modal = lazy(() => import("./pages/components/modal"));
const Carousel = lazy(() => import("./pages/components/carousel"));
const Pagination = lazy(() => import("./pages/components/pagination"));
const TabsAc = lazy(() => import("./pages/components/tab-accordion"));
const Video = lazy(() => import("./pages/components/video"));

// forms components
const InputPage = lazy(() => import("./pages/forms/input"));
const TextareaPage = lazy(() => import("./pages/forms/textarea"));
const CheckboxPage = lazy(() => import("./pages/forms/checkbox"));
const RadioPage = lazy(() => import("./pages/forms/radio-button"));
const SwitchPage = lazy(() => import("./pages/forms/switch"));
const InputGroupPage = lazy(() => import("./pages/forms/input-group"));
const InputlayoutPage = lazy(() => import("./pages/forms/input-layout"));
const InputMask = lazy(() => import("./pages/forms/input-mask"));
const FormValidation = lazy(() => import("./pages/forms/form-validation"));
const FileInput = lazy(() => import("./pages/forms/file-input"));
const FormRepeater = lazy(() => import("./pages/forms/form-repeater"));
const FormWizard = lazy(() => import("./pages/forms/form-wizard"));
const SelectPage = lazy(() => import("./pages/forms/select"));
const Flatpicker = lazy(() => import("./pages/forms/date-time-picker"));


// chart page
const AppexChartPage = lazy(() => import("./pages/chart/appex-chart"));
const ChartJs = lazy(() => import("./pages/chart/chartjs"));
const Recharts = lazy(() => import("./pages/chart/recharts"));

// map page
const MapPage = lazy(() => import("./pages/map"));

// table pages
const BasicTablePage = lazy(() => import("./pages/table/table-basic"));
const TanstackTable = lazy(() => import("./pages/table/react-table"));

// utility pages
const InvoicePage = lazy(() => import("./pages/utility/invoice"));
const InvoiceAddPage = lazy(() => import("./pages/utility/invoice-add"));
const InvoicePreviewPage = lazy(() =>
	import("./pages/utility/invoice-preview")
);
const InvoiceEditPage = lazy(() => import("./pages/utility/invoice-edit"));
const PricingPage = lazy(() => import("./pages/utility/pricing"));
const BlankPage = lazy(() => import("./pages/utility/blank-page"));
const ComingSoonPage = lazy(() => import("./pages/utility/coming-soon"));
const UnderConstructionPage = lazy(() =>
	import("./pages/utility/under-construction")
);
const BlogPage = lazy(() => import("./pages/utility/blog"));
const BlogDetailsPage = lazy(() => import("./pages/utility/blog/blog-details"));
const FaqPage = lazy(() => import("./pages/utility/faq"));
const Settings = lazy(() => import("./pages/utility/settings"));
const Profile = lazy(() => import("./pages/utility/profile"));
const IconPage = lazy(() => import("./pages/icons"));
const NotificationPage = lazy(() => import("./pages/utility/notifications"));
const ChangelogPage = lazy(() => import("./pages/changelog"));

// widget pages
const BasicWidget = lazy(() => import("./pages/widget/basic-widget"));
const StatisticWidget = lazy(() => import("./pages/widget/statistic-widget"));

// app page

const EmailPage = lazy(() => import("./pages/app/email"));
const ChatPage = lazy(() => import("./pages/app/chat"));


const KanbanPage = lazy(() => import("./pages/app/kanban"));
const CalenderPage = lazy(() => import("./pages/app/calendar"));

//Ecommerce-Pages

//Dashboard entreprise

const Portfolio = lazy(() => import("./pages/EntreprisBTP/Portfolio.jsx"));
const Gestionclients = lazy(() =>
	import("./pages/EntreprisBTP/Gestionclients.jsx")
);
const Conseils = lazy(() => import("./pages/EntreprisBTP/Conseil.jsx"));
const Annonce = lazy(() => import("./pages/EntreprisBTP/Annonce.jsx"));
const Actualite = lazy(() => import("./pages/EntreprisBTP/Actualite.jsx"));

const Visualisationbesoin = lazy(() =>
	import("./pages/EntreprisBTP/Visualisation.jsx")
);


const Contrat = lazy(() => import("./pages/EntreprisBTP/contrat.jsx"));
const Devisenattente = lazy(() => import("./pages/EntreprisBTP/Devis.jsx"));
const Devisaccepte = lazy(() =>
	import("./pages/EntreprisBTP/devisAccepte.jsx")
);
const Devisenevaluation = lazy(() =>
	import("./pages/EntreprisBTP/devisAttente.jsx")
);
const Formulaireannonce = lazy(() =>
	import("./pages/EntreprisBTP/FormulaireAnnonce.jsx")
);
const Voirplus = lazy(() => import("./pages/EntreprisBTP/VoirPlus.jsx"));

//Dashboard archi

const Devisarchitect = lazy(() => import("./pages/Architecture/Devis.jsx"));
const Devisacceptearchi = lazy(() =>
	import("./pages/Architecture/devisAccepte.jsx")
);
const Devisenevaluationarchi = lazy(() =>
	import("./pages/Architecture/devisAttente.jsx")
);
const Portfolioarchi = lazy(() => import("./pages/Architecture/Portfolio.jsx"));
const Visualisationarchi = lazy(() =>
	import("./pages/Architecture/Visualisation.jsx")
);
//Dashboard bureau d'etude
const Portfoliobureau = lazy(() =>
	import("./pages/BureaudEtudeBTP/Portfoliobureau.jsx")
);

const PortfolioEvaluation = lazy(() =>
	import("./pages/BureaudEtudeBTP/PortfolioEvaluation")
);
const Demandedevis = lazy(() =>
	import("./pages/BureaudEtudeBTP/demandedevis.jsx")
);

const Offreservice = lazy(() =>
	import("./pages/BureaudEtudeBTP/offreservice.jsx")
);

const Visualisationbureau = lazy(() =>
	import("./pages/BureaudEtudeBTP/visualisationbureau.jsx")
);

import Loading from "@/components/Loading";

import VusialisationDevis from "./pages/table/react-tables/VusialisationDevis";
import Devisdetaillé from "./pages/table/react-tables/Devisdetaillé";
import ListCalendar from "./pages/ListCalendar";

function App() {
	return (
		<main className="App  relative">
			<Routes>
				<Route path="/" element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<LoginGroupEntry />} />
					<Route path="/login2" element={<Login2 />} />
					<Route path="/login3" element={<Login3 />} />
					<Route path="/register" element={<Register />} />
					<Route path="/register2" element={<Register2 />} />
					<Route path="/register3" element={<Register3 />} />
					<Route path="/register4" element={<Register4 />} />
					<Route path="/forgot-password" element={<ForgotPass />} />
					<Route path="/forgot-password2" element={<ForgotPass2 />} />
					<Route path="/forgot-password3" element={<ForgotPass3 />} />
					<Route path="/lock-screen" element={<LockScreen />} />
					<Route path="/lock-screen2" element={<LockScreen2 />} />
					<Route path="/lock-screen3" element={<LockScreen3 />} />
				</Route>
				<Route path="/*" element={<Layout />}>
					<Route path="ListCalendar" element={<ListCalendar />} />

					<Route path="modification/:id" element={<Modification />} />
					<Route
						path="modificationfacture/:id"
						element={<ModificationFacture />}
					/>
					<Route path="Edition_Facture/:id" element={<EditionFacture />} />
					<Route path="facture/:id" element={<Visualisation />} />
					<Route path="bon_att_livraison" element={<Attliv />} />
				
					<Route path="bon_att_payement" element={<Attpay />} />
					<Route path="bon_livre" element={<Livraieffect />} />
					<Route path="bon_refuse" element={<Bonrefuse />} />
					<Route path="requete" element={<Requete />} />
					<Route path="vusialisationdevis" element={<VusialisationDevis />} />
					<Route path="Devisdetaillé/:id" element={<Devisdetaillé />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="paiement" element={<Paiement />} />
					<Route path="proforma" element={<Proforma />} />
					<Route path="profilquin" element={<Profilquincail />} />

					<Route path="crm" element={<CrmPage />} />
					<Route path="reponserequete/:id" element={<Reponserequete />} />
					<Route path="project" element={<ProjectPage />} />
					<Route path="banking" element={<BankingPage />} />
					{/* App pages */}
				
					<Route path="email" element={<EmailPage />} />
					<Route path="chat" element={<ChatPage />} />
					
					<Route path="kanban" element={<KanbanPage />} />
					<Route path="calender" element={<CalenderPage />} />
					{/* Components pages */}
					<Route path="button" element={<Button />} />
					<Route path="dropdown" element={<Dropdown />} />
					<Route path="badges" element={<Badges />} />
					<Route path="colors" element={<Colors />} />
					<Route path="typography" element={<Typography />} />
					<Route path="alert" element={<Alert />} />
					<Route path="progress-bar" element={<Progressbar />} />
					<Route path="card" element={<Card />} />
					<Route path="image" element={<Image />} />
					<Route path="Placeholder" element={<Placeholder />} />
					<Route path="tooltip-popover" element={<Tooltip />} />
					<Route path="modal" element={<Modal />} />
					<Route path="carousel" element={<Carousel />} />
					<Route path="Paginations" element={<Pagination />} />
					<Route path="tab-accordion" element={<TabsAc />} />
					<Route path="video" element={<Video />} />
					<Route path="input" element={<InputPage />} />
					<Route path="textarea" element={<TextareaPage />} />
					<Route path="checkbox" element={<CheckboxPage />} />
					<Route path="radio-button" element={<RadioPage />} />
					<Route path="switch" element={<SwitchPage />} />
					<Route path="input-group" element={<InputGroupPage />} />
					<Route path="input-layout" element={<InputlayoutPage />} />
					<Route path="input-mask" element={<InputMask />} />
					<Route path="form-validation" element={<FormValidation />} />
					<Route path="file-input" element={<FileInput />} />
					<Route path="form-repeater" element={<FormRepeater />} />
					<Route path="form-wizard" element={<FormWizard />} />
					<Route path="select" element={<SelectPage />} />
					<Route path="date-time-picker" element={<Flatpicker />} />
					<Route path="appex-chart" element={<AppexChartPage />} />
					<Route path="chartjs" element={<ChartJs />} />
					<Route path="recharts" element={<Recharts />} />
					<Route path="map" element={<MapPage />} />
					<Route path="table-basic" element={<BasicTablePage />} />
					<Route path="react-table" element={<TanstackTable />} />
					<Route path="invoice" element={<InvoicePage />} />
					<Route path="invoice-add" element={<InvoiceAddPage />} />
					<Route path="invoice-preview" element={<InvoicePreviewPage />} />
					<Route path="invoice-edit" element={<InvoiceEditPage />} />
					<Route path="pricing" element={<PricingPage />} />
					<Route path="blank-page" element={<BlankPage />} />
					<Route path="blog" element={<BlogPage />} />
					<Route path="blog-details" element={<BlogDetailsPage />} />
					<Route path="faq" element={<FaqPage />} />
					<Route path="settings" element={<Settings />} />
					<Route path="profile" element={<Profile />} />
					<Route path="basic" element={<BasicWidget />} />
					<Route path="statistic" element={<StatisticWidget />} />
					<Route path="icons" element={<IconPage />} />
					<Route path="notifications" element={<NotificationPage />} />
					<Route path="changelog" element={<ChangelogPage />} />

					<Route path="*" element={<Navigate to="/404" />} />

					{/* architecture */}
					<Route path="architecture_devis" element={<Devisarchitect />} />

					<Route
						path="devis_en_evaluation_archi"
						element={<Devisenevaluationarchi />}
					/>
					<Route path="devis_accepte_archi" element={<Devisacceptearchi />} />
					<Route path="profil_archi" element={<Portfolioarchi />} />
					<Route
						path="visualisationbesoin_archi/:id"
						element={<Visualisationarchi />}
					/>

					{/* Dashboard entreprise */}
					<Route path="profil" element={<Portfolio />} />
					<Route path="agenda" element={<Gestionclients />} />
					<Route path="chat" element={<Conseils />} />
					<Route path="annonce" element={<Annonce />} />
					<Route path="actualite" element={<Actualite />} />
					<Route path="formulaireannonce" element={<Formulaireannonce />} />

					<Route path="contrat" element={<Contrat />} />
					<Route path="devis_en_attente" element={<Devisenattente />} />
					<Route path="devis_en_evaluation" element={<Devisenevaluation />} />
					<Route path="devis_accepte" element={<Devisaccepte />} />
					<Route path="voirplus/:id" element={<Voirplus />} />
					<Route
						path="visualisationbesoin/:id"
						element={<Visualisationbesoin />}
					/>
				</Route>
				<Route
					path="/404"
					element={
						<Suspense fallback={<Loading />}>
							<Error />
						</Suspense>
					}
				/>

				{/* Dashboard bureau d'etude btp */}
				<Route path="/*" element={<Layout />}>
					<Route path="demandedevis" element={<Demandedevis />} />
				

					<Route
						path="portfolio_en_evaluation"
						element={<PortfolioEvaluation />}
					/>
					<Route path="profileb" element={<Portfoliobureau />} />
					<Route path="offre_services" element={<Offreservice />} />

					<Route
						path="visualisationbesoin_bureau/:id"
						element={<Visualisationbureau />}
					/>
				</Route>
				<Route
					path="/404"
					element={
						<Suspense fallback={<Loading />}>
							<Error />
						</Suspense>
					}
				/>

				<Route
					path="/coming-soon"
					element={
						<Suspense fallback={<Loading />}>
							<ComingSoonPage />
						</Suspense>
					}
				/>
				<Route
					path="/under-construction"
					element={
						<Suspense fallback={<Loading />}>
							<UnderConstructionPage />
						</Suspense>
					}
				/>
			</Routes>
		</main>
	);
}

export default App;
