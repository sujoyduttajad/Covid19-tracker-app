import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({ title, cases, total, isRed, isGrey, active, ...props }) {
    return (
            <Card 
                className={`infoBox ${active && "infoBox--selected"} 
                    ${isGrey && "infoBox--grey"} ${isRed && 'infoBox--red'}`}
                onClick={props.onClick}
                >
                <CardContent>
                    {/* Title i.e. Coronavirus cases */}
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>
                    {/* Number of cases */}
                    <h2 
                        className={`infoxBox__cases ${!isRed && "infoBox__cases--green"} ${
                            isGrey && "infoBox__cases--grey"}`} >
                                {props.isloading ? <i className="fa fa-cog fa-spin fa-fw" /> : cases}
                    </h2>
                    {/* Total */}
                    <Typography className="infoBox__total" color="textSecondary" >
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
    )
}

export default InfoBox
