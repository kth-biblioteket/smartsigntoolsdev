const database = require('./db');

//Hämta alla Events
const readEvents = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM events
                     ORDER BY eventtime`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta alla Events efter angivet datum
const readEventsByDate = (eventtime) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM events
                     WHERE eventtime > ?
                    ORDER BY eventtime`;
        database.db.query(database.mysql.format(sql,[eventtime]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta alla Events med paginering
const readEventsPaginated = (page, limit) => {
    return new Promise(function (resolve, reject) {
        limit = parseInt(limit)
        let offset = (limit * page) - limit;
        const sql = `SELECT * FROM events
                    WHERE eventtime > now()
                    ORDER BY eventtime
                    LIMIT ? OFFSET ?`;
        database.db.query(database.mysql.format(sql,[limit, offset]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta alla som är publicerade med datum > nu 
const readAllPublished = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM events 
                    WHERE published = 1 AND eventtime > now()
                    ORDER BY eventtime`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta ett event GUID
const readEventGuid = (guid) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM events 
                WHERE guid = ?`;
        database.db.query(database.mysql.format(sql,[guid]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta ett event contentid
const readEventContentid = (contentid) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM events 
                WHERE contentid = ?`;
        database.db.query(database.mysql.format(sql,[contentid]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta ett event ID
const readEventId = (id) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM events 
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Skapa ett event
const createEvent = (guid, contentid, eventtime, pubstarttime, pubendtime, smartsignlink, published, published_as_image, lang) => {
    return new Promise(function (resolve, reject) {

        const sql = `INSERT INTO events(guid, contentid, eventtime, pubstarttime, pubendtime, smartsignlink, published, published_as_image, lang)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        database.db.query(database.mysql.format(sql,[guid, contentid, eventtime, pubstarttime, pubendtime, smartsignlink, published, published_as_image, lang]), async function(err, result) {
            if(err) {
                console.error(err);
                reject(err.message)
            } else {
                //Lägg till fält
                //Skriv om detta!!
                if(result.insertId != 0) {
                    await createEventField(result.insertId, 1)
                    await createEventField(result.insertId, 2)
                    await createEventField(result.insertId, 3)
                    await createEventField(result.insertId, 4)
                    await createEventField(result.insertId, 5)
                    await createEventField(result.insertId, 6)
                    await createEventField(result.insertId, 7)
                    await createEventField(result.insertId, 8)
                    await createEventField(result.insertId, 9)
                }

                const successMessage = "The event was entered successfully."
                resolve(result.insertId);
            }
        });
    })
};

//Uppdatera ett event
const updateEvent = (guid, contentid, eventtime, pubstarttime, pubendtime, smartsignlink, published, published_as_image, lang, id) => {
    return new Promise(function (resolve, reject) {

        const sql = `UPDATE events 
                SET guid = ?, contentid = ?, eventtime = ?, pubstarttime = ?, pubendtime = ?, smartsignlink = ?, published = ?, published_as_image = ?, lang= ? 
                WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[guid, contentid, eventtime, pubstarttime, pubendtime, smartsignlink, published, published_as_image, lang, id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The event was successfully updated."
            resolve(successMessage);
        });
    })
};

//Radera ett event.
const deleteEvent = (guid) => {
    return new Promise(function (resolve, reject) {

        const sql = `DELETE FROM events 
                WHERE guid = ?`;
        database.db.query(database.mysql.format(sql,[guid]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The event was successfully deleted."
            resolve(successMessage);
        });
    })
};

const updateEventLang = (lang, id) => {
    return new Promise(function (resolve, reject) {
        const sql = `UPDATE events 
                SET lang= ? 
                WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[lang, id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The event was successfully updated."
            resolve(successMessage);
        });
    })
};

//Uppdatera ett event
const updateEventPublish = (id, published) => {
    return new Promise(function (resolve, reject) {
        const sql = `UPDATE events 
                SET published = ? 
                WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[published, id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The event was successfully updated."
            resolve(successMessage);
        });
    })
};

//Publicera ett event som image
const updateEventPublishAsImage = (id, published_as_image) => {
    return new Promise(function (resolve, reject) {
        const sql = `UPDATE events 
                SET published_as_image = ? 
                WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[published_as_image, id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The event was successfully updated."
            resolve(successMessage);
        });
    })
};

//Hämta fält för ett event
const readEventFields = (events_id) => {
    return new Promise(function (resolve, reject) {

        /*
        const sql = SELECT 
                        fields.id, eventfields.events_id, fields.type, fields.name, fields.description, fields.sortable 
                    FROM fields
                    LEFT JOIN eventfields ON eventfields.fields_id = fields.id AND eventfields.events_id = 242
                    ORDER BY sortable`;
        */

        const sql = `SELECT 
                        fields.id, 
                        eventfields.events_id, 
                        fields.type, 
                        fields.name, 
                        fields.description, 
                        fields.sortable,
                        COALESCE(eventfieldsorder.sortorder, -1) AS sortorder
                    FROM 
                        fields
                    LEFT JOIN 
                        eventfields ON eventfields.fields_id = fields.id AND eventfields.events_id = ?
                    LEFT JOIN 
                        eventfieldsorder ON eventfieldsorder.event_id = ? AND eventfieldsorder.field_id = fields.id
                    ORDER BY
                        fields.sortable,
                        sortorder,
                        name`
        database.db.query(database.mysql.format(sql,[events_id, events_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Lägg till ett events fält
const createEventField = (event_id, field_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventfields(events_id, fields_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, field_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The field was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events fält
const deleteEventField = (event_id, field_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventfields
                    WHERE events_id = ? AND fields_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id, field_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The field was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Hämta bakgrundsfärg för event
const readEventBgColor = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT colors.id, eventbgcolor.event_id, colors.name, colors.code, colors.description
                    FROM eventbgcolor
                    JOIN colors ON eventbgcolor.color_id = colors.id
                    AND eventbgcolor.event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta textfärg för event
const readEventTextColor = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT colors.id, eventtextcolor.event_id, colors.name, colors.code, colors.description
                    FROM eventtextcolor
                    JOIN colors ON eventtextcolor.color_id = colors.id
                    AND eventtextcolor.event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta logofärg för event
const readEventLogoColor = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT colors.id, eventlogocolor.event_id, colors.name, colors.code, colors.description
                    FROM eventlogocolor
                    JOIN colors ON eventlogocolor.color_id = colors.id
                    AND eventlogocolor.event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta bild för event
const readEventImage = (events_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT images.id, eventimage.events_id, images.type, images.name, images.size, images.fullpath
                    FROM eventimage
                    JOIN images ON eventimage.images_id = images.id
                    AND eventimage.events_id = ?`;
        database.db.query(database.mysql.format(sql,[events_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta Eventimageoverlay för event
const readEventImageOverlay = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT id, event_id, enabled
                    FROM eventimageoverlay
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};


//Hämta Eventimageoverlay opacity för event
const readEventImageOverlayOpacity = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT id, event_id, opacity
                    FROM eventimageoverlayopacity
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta Eventimage Header för event
const readEventImageHeader = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT id, event_id
                    FROM eventimageheader
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta Eventfieldsorder för event
const readEventFieldsOrder = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT id, event_id, field_id, sortorder
                    FROM eventfieldsorder
                    WHERE event_id = ?
                    ORDER BY sortorder`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta Linjemönster för event
const readEventLinePattern = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT 
                       event_id, linepatterns.id, linepatterns.name, linepatterns.code 
                    FROM 
                        eventlinepattern
                    JOIN 
                        linepatterns ON linepatterns.id = linepattern_id
                    WHERE 
                        event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })

};

//Hämta Linjemönsters placering för event
const readEventLinePatternPlacement = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT 
                        event_id, linepatternplacements.id, linepatternplacements.name, linepatternplacements.code 
                    FROM 
                        eventlinepatternplacement
                    JOIN 
                        linepatternplacements ON linepatternplacements.id = linepatternplacement_id
                    WHERE 
                        event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta textfärg för event
const readEventLinePatternColor = (event_id) => {
    return new Promise(function (resolve, reject) {

        const sql = `SELECT colors.id, eventlinepatterncolor.event_id, colors.name, colors.code, colors.description
                    FROM eventlinepatterncolor
                    JOIN colors ON eventlinepatterncolor.color_id = colors.id
                    AND eventlinepatterncolor.event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Lägg till ett events bakgrundsfärd
const createEventBgColor = (event_id, color_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventbgcolor(event_id, color_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, color_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events bakgrundsfärg
const deleteEventBgColor = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventbgcolor
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events textfärd
const createEventTextColor = (event_id, color_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventtextcolor(event_id, color_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, color_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events textfärg
const deleteEventTextColor = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventtextcolor
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events bakgrundsfärd
const createEventLogoColor = (event_id, color_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventlogocolor(event_id, color_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, color_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events bakgrundsfärg
const deleteEventLogoColor = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventlogocolor
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events bild
const createEventImage = (event_id, image_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventimage(events_id, images_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, image_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The image was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events bild
const deleteEventImage = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventimage
                    WHERE events_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The image was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events imageoverlay
const createEventImageOverlay = (event_id, enabled) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventimageoverlay(event_id, enabled)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, enabled]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The imageoverlay was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events imageoverlay
const deleteEventImageOverlay = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventimageoverlay
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The imageoverlay was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events imageoverlay opacity
const createEventImageOverlayOpacity = (event_id, opacity) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventimageoverlayopacity(event_id, opacity)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, opacity]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The imageoverlay opacity was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events imageoverlay
const deleteEventImageOverlayOpacity = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventimageoverlayopacity
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The imageoverlay opacity was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events imageheader
const createEventImageHeader = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventimageheader(event_id)
                VALUES(?)`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The imageheader was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events imageheader
const deleteEventImageHeader = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventimageheader
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The imageheader was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events fieldsorder
const createEventFieldsOrder = (event_id, field_id, sortorder) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventfieldsorder(event_id, field_id, sortorder)
                VALUES(?, ?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, field_id, sortorder]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The Fieldsorder was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events fieldsorder
const deleteEventFieldsOrder = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventfieldsorder
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The Fieldsorder was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events linjemönster
const createEventLinePattern = (event_id, linepattern_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventlinepattern(event_id, linepattern_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, linepattern_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The linepattern was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events linjemönster
const deleteEventLinePattern = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventlinepattern
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The linepattern was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events linjemönsters placering
const createEventLinePatternPlacement = (event_id, linepatternplacement_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventlinepatternplacement(event_id, linepatternplacement_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, linepatternplacement_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The linepattern was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events linjemönsters placering
const deleteEventLinePatternPlacement = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventlinepatternplacement
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The linepattern was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Lägg till ett events linjemönsters färg
const createEventLinePatternColor = (event_id, color_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO eventlinepatterncolor(event_id, color_id)
                VALUES(?, ?)`;
        database.db.query(database.mysql.format(sql,[event_id, color_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully created."
            resolve(successMessage);
        });
    })
};

//Ta bort ett events linjemönsters färg
const deleteEventLinePatternColor = (event_id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM eventlinepatterncolor
                    WHERE event_id = ?`;
        database.db.query(database.mysql.format(sql,[event_id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The color was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Hämta färger
const readColors = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * 
                    FROM 
                        colors
                    ORDER BY 
                        sortorder`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta linjemönster
const readLinePatterns = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT
                        id, name, description, code
                    FROM 
                        linepatterns 
                    ORDER BY 
                        code`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta linjemönsters placering
const readLinePatternPlacements = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT
                        id, name, description, code
                    FROM 
                        linepatternplacements 
                    ORDER BY 
                        name`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta alla bilder i bildbanken
const readImages = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM images`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta en bild från bildbanken
const readImage = (id) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM images 
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Lägg till en bild i bildbanken
const createImage = (fullpath, name, size, type) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO images(fullpath, name, size, type)
                VALUES(?, ?, ?, ?)`;
        database.db.query(database.mysql.format(sql,[fullpath, name, size, type]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The image was successfully created."
            resolve(successMessage);
        });
    })
};

//Uppdatera bild i bildbanken
const updateImage = (id, name) => {
    return new Promise(function (resolve, reject) {
        const sql = `UPDATE images
                    SET name = ?
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[name, id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The image was successfully updated."
            resolve(successMessage);
        });
    })
};

//Ta bort en bild ur bildbanken
const deleteImage = (id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM images
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The image was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Hämta qrcodetracking statistik
const readQrcodetracking = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT events_id, url, count(*) as nrofscans FROM qrcodetracking 
                    GROUP BY events_id, url
                    ORDER BY nrofscans DESC`;
        database.db.query(database.mysql.format(sql),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta qrcodetracking statistik
const readQrcodetrackingByTimePeriod = (scantime_from, scantime_to) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT
                        url,
                        MIN(DATE_FORMAT(scantime, '%Y-%m-%d %H:%i:%s')) AS first_scan,
                        MAX(DATE_FORMAT(scantime, '%Y-%m-%d %H:%i:%s')) AS last_scan,
                        COUNT(*) AS nrofscans
                    FROM
                        qrcodetracking
                    WHERE
                        DATE_FORMAT(scantime, '%Y-%m-%d') >= ? AND DATE_FORMAT(scantime, '%Y-%m-%d') <= ?
                    GROUP BY
                        url  
                    ORDER BY nrofscans DESC;`;
        database.db.query(database.mysql.format(sql,[scantime_from, scantime_to]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta alla qrcodetrackings
const readAllQrcodetracking = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT events_id, url, browser, DATE_FORMAT(scantime, '%Y-%m-%d %H:%i:%s') as scantime FROM qrcodetracking`;
        database.db.query(database.mysql.format(sql),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Lägg till qrcodetracking
const createQrcodetracking = (events_id, url, browser) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO qrcodetracking(events_id, url, browser)
                VALUES(?, ?, ?)`;
        database.db.query(database.mysql.format(sql,[events_id, url, browser]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The qrcodetracking was saved"
            resolve(successMessage);
        });
    })
};

//Hämta alla qrcodes
const readQrCodesGeneral = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM qrcodegeneral`;
        database.db.query(database.mysql.format(sql,[]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Hämta en qrcode
const readQrCodeGeneral = (id) => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM qrcodegeneral 
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

//Lägg till qrcode
const createQrCodeGeneral = (url) => {
    return new Promise(function (resolve, reject) {
        const sql = `INSERT INTO qrcodegeneral(url)
                VALUES(?)`;
        database.db.query(database.mysql.format(sql,[url]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The qrcodeurl was successfully created."
            resolve(result.insertId);
        });
    })
};

//Uppdatera qrcode generell
const updateQrCodeGeneral = (id, url) => {
    return new Promise(function (resolve, reject) {
        const sql = `UPDATE qrcodegeneral
                    SET url = ?
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[url, id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The qrcode was successfully updated."
            resolve(successMessage);
        });
    })
};

//Ta bort qrcode generell
const deleteQrCodeGeneral = (id) => {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE FROM qrcodegeneral
                    WHERE id = ?`;
        database.db.query(database.mysql.format(sql,[id]),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            const successMessage = "The qrcode was successfully deleted."
            resolve(successMessage);
        });
    })
};

//Hämta daglig wifi-kod
const readDailyWiFiCode = () => {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM dailywifi 
                    WHERE code_date = CURDATE()`;
        database.db.query(database.mysql.format(sql),(err, result) => {
            if(err) {
                console.error(err);
                reject(err.message)
            }
            resolve(result);
        });
    })
};

module.exports = {
    readEvents,
    readEventsByDate,
    readEventsPaginated,
    readAllPublished,
    readEventGuid,
    readEventContentid,
    readEventId,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventLang,
    updateEventPublish,
    updateEventPublishAsImage,
    readEventFields,
    createEventField,
    deleteEventField,
    readEventBgColor,
    createEventBgColor,
    deleteEventBgColor,
    readEventTextColor,
    createEventTextColor,
    deleteEventTextColor,
    readEventLogoColor,
    createEventLogoColor,
    deleteEventLogoColor,
    readEventImage,
    createEventImage,
    deleteEventImage,
    readEventImageOverlay,
    createEventImageOverlay,
    deleteEventImageOverlay,
    readEventImageOverlayOpacity,
    createEventImageOverlayOpacity,
    deleteEventImageOverlayOpacity,
    readEventImageHeader,
    createEventImageHeader,
    deleteEventImageHeader,
    readEventFieldsOrder,
    createEventFieldsOrder,
    deleteEventFieldsOrder,
    readEventLinePattern,
    createEventLinePattern,
    deleteEventLinePattern,
    readEventLinePatternPlacement,
    createEventLinePatternPlacement,
    deleteEventLinePatternPlacement,
    readEventLinePatternColor,
    createEventLinePatternColor,
    deleteEventLinePatternColor,
    readColors,
    readLinePatterns,
    readLinePatternPlacements,
    readImages,
    readImage,
    createImage,
    updateImage,
    deleteImage,
    readQrcodetracking,
    readQrcodetrackingByTimePeriod,
    readAllQrcodetracking,
    createQrcodetracking,
    readQrCodesGeneral,
    readQrCodeGeneral,
    createQrCodeGeneral,
    updateQrCodeGeneral,
    deleteQrCodeGeneral,
    readDailyWiFiCode
};