import Head from 'next/head'
import {container, main} from '../styles/Home.module.css'
import Profile from "../components/Profile";
import Card from "../components/Card";
import Modal from "../components/Modal";
import {useState} from "react";
import modalStyles from "../styles/Modal.module.css";
import db from "../firebaseDb/firebaseAdmin";
import About from "../components/section/About";
export async function getStaticProps(context) {
	try {
		let projects = [], profile = {}
		
		const profileCollectionRef = db.collection("profile").limit(1);
		const profileSnapshot = await profileCollectionRef.get();
		if (!profileSnapshot.empty) {
			const profileDoc = profileSnapshot.docs[0];
			profile = {id: profileDoc.id, ...profileDoc.data()}
			const linksRef = await db.collection(`profile/${profileDoc.id}/links`).get();
			const links = linksRef.docs.map(link => {
				return {id: link.id, ...link.data()}
			})
			
			profile.links = await Promise.all(links);
		}
		const collectionRef = db.collection("projects");
		const snapshots = await collectionRef.get();
		if (!snapshots.empty) {
			projects = snapshots.docs.map(async project => {
				const linksRef = await db.collection(`projects/${project.id}/links`).get();
				const links = linksRef.docs.map(link => {
					return {id: link.id, ...link.data()}
				})
				
				
				const imagesRef = await db.collection(`projects/${project.id}/images`).get();
				const images = imagesRef.docs.map(image => {
					return {id: image.id, ...image.data()}
				})
				
				return {id: project.id, ...project.data(), links: links, images: images};
			});
		}
		
		projects = await Promise.all(projects);
		
		return {
			props: {projects: projects, profile: profile},
			revalidate: 60
		}
		
	} catch (e) {
		return {
			props: {projects: [], profile: null}, // will be passed to the page component as props
		}
	}
}

export default function Home({projects = [], profile = null}) {
	const [modalOpen, setModalOpen] = useState(false);
	const [currentTab, setCurrentTab] = useState('about');
	const [selectedItem, setSelectedItem] = useState(null);
	const handleSelectedItem = (project) => {
		setSelectedItem(project)
		setModalOpen(true)
	}
	const handleModalClose = (value) => {
		setModalOpen(false)
		setSelectedItem(null)
	}
	
	const handleTabSelection = (value) => {
		setCurrentTab(value)
	}
	const checkActiveTab = (value) => {
		return currentTab === value ? 'active' : ''
	}
	
	return (
			<>
				<Head key={"main"}>
					{
						profile ? <title>{profile.firstName + " " + profile.lastName}</title> : null
						
					}
					{/*<meta name="description" content="Generated by create next app"/>*/}
					<link rel="icon" href="/favicon.ico"/>
				</Head>
				<main className={main}>
					<Profile profile={profile}/>
					
					<div className="container overflow-hidden">
						<div className={"tabs"}>
							<a href="#" className={`tab-item ${checkActiveTab("about")}`}
							   onClick={() => handleTabSelection('about')}>About</a>
							<a href="#" className={`tab-item ${checkActiveTab("projects")}`}
							   onClick={() => handleTabSelection('projects')}>Projects</a>
							<a href="#" className={`tab-item ${checkActiveTab("blog")}`}
							   onClick={() => handleTabSelection('blog')}>Blog</a>
							<a href="#" className={`tab-item ${checkActiveTab("contact")}`}
							   onClick={() => handleTabSelection('contact')}>Contact</a>
						</div>
						
						{(() => {
							if (currentTab === "about") {
								return (
										<About/>
								)
							} else if (currentTab === "projects") {
								return (
										<div className={"row gx-5"}>
											{
												projects.map((project, index) =>
														<div className={`col-md-6 mb-4`} key={index}>
															<a href={"#"} onClick={(event) => {
																event.preventDefault()
																handleSelectedItem(project)
															}}>
																<Card maxWidth={"100%"} className={"mx-auto mb-3"}
																      imgSrc={
																	      project.images ?
																			      (() => {
																				      if (project.images.length) {
																					      const thumbnail = project.images.find(item => item.isThumbnail);
																					      return thumbnail ? thumbnail.url : project.images[0].url;
																				      } else {
																					      return "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
																				      }
																			      })() : null}
																      alt={project.title}
																/>
																<h4 className={"mb-0"}>{project.title}</h4>
															</a>
														
														</div>
												)
											}
										</div>
								)
							} else {
								return (
										<div className={"d-flex align-center justify-center"} style={{minHeight: "10rem"}}>
											<h4>Coming Soon</h4>
										</div>
								)
							}
						})()}
						
					</div>
					
					{
						selectedItem ?
								(
										<Modal title={selectedItem.title} modalValue={modalOpen} closeModal={handleModalClose}>
											<div className={modalStyles.modalLinks}>
												<div className={"d-flex flex-column"}>
													{
														selectedItem.links.map((item, index) => {
															return (<a rel={"noreferrer"} href={item.url} target={"_blank"} key={index}>
																<i className={item.icon + " la-2x mb-2"}/>
															</a>)
														})
													}
												</div>
											</div>
											<div className={"d-flex flex-column"} style={{
												borderBottomLeftRadius: "10px",
												borderBottomRightRadius: "10px",
												overflow: 'hidden'
											}}>
												{
													selectedItem.images && selectedItem.images.filter(item => !item.isThumbnail).map((item, index) => {
														return <img className={modalStyles.modalImage} src={item.url} key={index} loading={"lazy"}
														            alt={selectedItem.title + ' ' + index}/>
													})
												}
											</div>
										
										
										</Modal>
								) : null
					}
				
				</main>
			
			</>
	)
}
