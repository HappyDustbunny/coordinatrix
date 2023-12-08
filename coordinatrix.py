from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coordinatrix.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    
    # Define a one-to-many relationship with events
    events = db.relationship('UserEvent', back_populates='user')

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    initiator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    time = db.Column(db.String)
    place = db.Column(db.String)
    name_description = db.Column(db.String)
    
    # Define a one-to-many relationship with users
    participants = db.relationship('UserEvent', back_populates='event')

class UserEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    status = db.Column(db.String)  # Invited/Participate/Does Not Participate
    
    # Define many-to-one relationships with users and events
    user = db.relationship('User', back_populates='events')
    event = db.relationship('Event', back_populates='participants')

if __name__ == '__main__':
    # Create the database and tables
    db.create_all()

    # Add any additional logic or routes for your Flask application
    app.run(debug=True)