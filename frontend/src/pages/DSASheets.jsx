// DSASheet.jsx
import { Link } from 'react-router-dom'

const sheets = [
  { id: "a2z_sheet_striver", name: "A2Z Sheet Striver",numberOfQuestions: 455},
  { id: "SDE_sheet_striver", name: "SDE Sheet Striver",numberOfQuestions: 191},
]

const DSASheets = () => {
  return (
    <div className="sheets-container">
      {sheets.map(sheet => (
        <Link to={`/DSA_Sheets/${sheet.id}`} key={sheet.id} className="sheet-card">
          <h3>{sheet.name}</h3>
          <p>{sheet.numberOfQuestions}</p>
        </Link>
      ))}
    </div>
  )
}
export default DSASheets
