import React, {useState} from 'react';

function ExperienceForm({experience = null, onSuccessAction}) {
	
	const [formData, setFormData] = useState(experience ? experience : {
		designation: null,
		company: null,
		startDate: null,
		endDate: null,
		isPresent: false,
		description: null,
	})
	const updateFormData = (event, value = null) => {
		setFormData(prevState => ({
			...prevState,
			[event.target.name]: value ? value : event.target.value
		}))
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		const form = new FormData(e.target)
		const formProps = Object.fromEntries(form);
		try {
			const response = await fetch(`/api/admin/experience${experience ? `/${experience.id}` : ''}`, {
				method: !experience ? "post" : "put",
				body: JSON.stringify(formProps),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			})
			const {data} = await response.json()
			if (data.experience) {
				onSuccessAction ? onSuccessAction(data.experience) : null
			}
		} catch (e) {
			console.log(e.message)
		}
	}
	
	return (
			<form className={"p-3"} onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="company" className={"form-label"}>Company</label>
					<input id={"company"} type="text" className={"form-control"} name={"company"} required
					       defaultValue={formData.company} onInput={updateFormData}/>
				</div>
				<div className="mb-3">
					<label htmlFor="designation" className={"form-label"}>Designation</label>
					<input id={"designation"} type="text" className={"form-control"} name={"designation"} required
					       defaultValue={formData.designation} onInput={updateFormData}/>
				</div>
				<div className={"row mb-3"}>
					<div className={"col-6"}>
						<label htmlFor="startDate" className={"form-label"}>Start Date</label>
						<input id={"startDate"} type="date" className={"form-control"} name={"startDate"} required
						       defaultValue={formData.startDate} onInput={updateFormData}/>
					</div>
					<div className={"col-6"}>
						<label htmlFor="endDate" className={"form-label"}>End Date</label>
						<input id={"endDate"} type="date" className={"form-control"} name={"endDate"}
						       defaultValue={formData.endDate} onInput={updateFormData}/>
						
					</div>
				</div>
				
				<div className="mb-3">
					<label htmlFor="isPresent" className={"form-label fs-12"}>
						<input id={"isPresent"} type="checkbox" name={"isPresent"}
						       defaultValue={formData.isPresent} onInput={updateFormData}/>
						Currently working here
					</label>
				</div>
				
				<div className="mb-3">
					<label htmlFor="description" className={"form-label"}>Description</label>
					<textarea rows={2} className={"form-control"} name={"description"} id={"description"} required
					          onInput={updateFormData} defaultValue={formData.description} maxLength={255}/>
				</div>
				<button type={"submit"} className={"btn pull-right"}>{!experience ? 'Submit' : 'Update'}</button>
			</form>
	);
}

export default ExperienceForm;