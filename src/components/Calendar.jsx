const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const DayRow = (props) => {
  const monthIndex = (months.indexOf(props.month) + 1).toString().padStart(2, '0')
  const firstDay = new Date(`2020-${monthIndex}-01T00:00:00.001`)
  const lastDay = new Date()
  lastDay.setFullYear(2020, months.indexOf(props.month) + 1, 0)
  console.log(lastDay)
  const monthDays = []

  while (firstDay < lastDay) {
    monthDays.push(firstDay.getDay())
    firstDay.setDate(firstDay.getDate() + 1)
  }

  const rangeArray = (b, e) => {
    const d = []
    while (b < e) {
      d.push(b)
      ++b
    }
    return d
  }

  const monLen = monthDays.length
  const dayArr = rangeArray(0, 37)
  const startDay = (monthDays[0] + 2) % 7
  let c = 0

  return <div className="flex-row-uniform">
    <div>{props.month}</div>
    {
      dayArr.map((val , i) => {
        if (i < startDay)
          return <div>&nbsp;</div>
        else
          return <div>{++c <= monLen ? c : ''}</div>
      })
    }
  </div>
}

const MonthRows = () => {
  return (
      <div>
        {
          months.map(m => <DayRow month={m} />)
        }
      </div>
  )
}

export default function Calendar() {
  const yearNow = new Date().getFullYear()

  return <div>
    {yearNow}
    <MonthRows />
  </div>
}
