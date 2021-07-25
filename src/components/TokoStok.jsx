import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
    root: {
      "maxWidth": "16rem",
    },
    media: {
      "height" : "20vh"
    },
});

const TokoStok = ({dataTokoStok}) => {
    const classes = useStyles()
    const [stok, setStok] = useState(0)

    return(
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={dataTokoStok.gambar}
                title={dataTokoStok.nama}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Dorayaki {dataTokoStok.rasa}
                </Typography>
                <Typography gutterBottom variant="h6" component="h2">
                    {dataTokoStok.deskripsi}
                </Typography>
            </CardContent>
            <div style={{display:"flex"}}>
                <TextField
                    id="filled-number"
                    label="Stok Dorayaki"
                    type="number"
                    InputProps={{
                        disabled: true,
                        defaultValue: 0,
                    }}
                    size="small"
                    variant="outlined"
                    style={{maxWidth: "10rem", margin: "1rem"}}
                />
                <IconButton color="primary" aria-label="edit stok" component="span">
                    <EditIcon />
                </IconButton>
            </div>
        </Card>
    )
}

export default TokoStok