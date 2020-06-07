import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import dayjs from "dayjs-ext";
import relativeTime from "dayjs-ext/plugin/relativeTime";
import { injectIntl, FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons/faExternalLinkAlt";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import { faInfo } from "@fortawesome/free-solid-svg-icons/faInfo";
import { faClone } from "@fortawesome/free-solid-svg-icons/faClone";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";

import IfFeature from "./if-feature";
import styles from "../assets/stylesheets/media-browser.scss";
import { proxiedUrlFor, scaledThumbnailUrlFor } from "../utils/media-url-utils";
import StateLink from "./state-link";
import { remixAvatar } from "../utils/avatar-utils";
import { fetchReticulumAuthenticated } from "../utils/phoenix-utils";
import { getReticulumFetchUrl } from "../utils/phoenix-utils";

const maxRoomCap = 50;

dayjs.extend(relativeTime);

const PUBLISHER_FOR_ENTRY_TYPE = {
  sketchfab_model: "Sketchfab",
  poly_model: "Google Poly",
  twitch_stream: "Twitch"
};

export function groupFeaturedRooms(featuredRooms) {
  if (!featuredRooms) {
    return [];
  }

  let groups = [];

  for (const room of featuredRooms) {
    const parts = room.name.split(" | ");

    if (parts.length === 2) {
      const [groupName, roomName] = parts;

      let group = groups.find(g => g.name === groupName);

      if (group) {
        group.rooms.push({ ...room, name: roomName });
      } else {
        groups.push({
          name: groupName,
          rooms: [{ ...room, name: roomName }],
          user_data: room.user_data
        });
      }
    } else {
      groups.push({
        name: room.name,
        rooms: [room],
        user_data: room.user_data
      });
    }
  }

  // console.log('groups', groups);
  groups = groups.sort((a, b) => a.name.localeCompare(b.name))
  // groups = groups.sort((a, b) => {
  //   if (a.user_data && a.user_data.group_order !== undefined && b.user_data && b.user_data.group_order !== undefined) {
  //     return a.user_data.group_order - b.user_data.group_order;
  //   }

  //   if (a.user_data && a.user_data.group_order !== undefined) {
  //     return -1;
  //   }

  //   if (b.user_data && b.user_data.group_order !== undefined) {
  //     return 1;
  //   }

  //   return 0;
  // });

  for (const group of groups) {
    // console.log(' - room', group);
    // Sort alphabetically
    group.rooms = group.rooms.sort((a, b) => a.name.localeCompare(b.name))
    // group.rooms = group.rooms.sort((a, b) => {
    //   if (a.user_data && a.user_data.room_order !== undefined && b.user_data && b.user_data.room_order !== undefined) {
    //     return a.user_data.room_order - b.user_data.room_order;
    //   }

    //   if (a.user_data && a.user_data.room_order !== undefined) {
    //     return -1;
    //   }

    //   if (b.user_data && b.user_data.room_order !== undefined) {
    //     return 1;
    //   }

    //   return 0;
    // });

    const mainRoom = group.rooms[0];
    group.description = mainRoom.description;
    group.thumbnail = mainRoom.images && mainRoom.images.preview && mainRoom.images.preview.url;
  }

  return groups;
}

export function makeSlug(name) {
  let slug = name.toLowerCase();

  // Remove non-word characters
  slug = slug.replace(/[^a-z0-9\s-_]/gi, "");

  // Reduce to single whitespace
  slug = slug.replace(/[\s-]+/g, " ");

  // Replace whitespace and underscores with dashes
  slug = slug.replace(/[\s_]+/g, "-");

  return slug;
}

class ConferenceRoomGroup extends Component {
  static propTypes = {
    group: PropTypes.object
  };

  constructor(props) {
    super(props);

    const groupName = props.group.name;

    let open = true;

    if (groupName.startsWith("Track ") || groupName.startsWith("Three Conference Streams")) {
      open = false;
    }

    this.state = {
      id: makeSlug(groupName),
      open
    };
  }

  showMore = e => {
    e.preventDefault();
    this.setState({ open: true });
  };

  render() {
    const { group } = this.props;

    let rooms;

    if (this.state.open) {
      rooms = group.rooms;
    } else {
      rooms = [];
      let emptyRooms = 0;

      for (let i = 0; i < group.rooms.length; i++) {
        const room = group.rooms[i];

        if (room.member_count > 0) {
          rooms.push(room);
        } else if (emptyRooms < 3) {
          rooms.push(room);
          emptyRooms++;
        }
      }
    }

    return (
      <div id={this.state.id} className={classNames(styles.card, styles.conferenceRoomGroup)}>
        <div className={styles.groupLeft}>
          <h2>
            {group.name}
            <a href={"#" + this.state.id} className={styles.groupLink}>
              <FontAwesomeIcon icon={faLink} />
            </a>
          </h2>
          {group.description && <p>{group.description}</p>}
          <ul className={styles.roomList}>
            {rooms.map(room => <RoomItem key={room.id} room={room} />)}
            {!this.state.open &&
              rooms.length !== group.rooms.length && (
                <li key="show-more">
                  <a href="#" onClick={this.showMore}>
                    Show more...
                  </a>
                </li>
              )}
          </ul>
        </div>
        <div className={styles.groupRight}>
          <img alt={group.name} src={group.thumbnail} />
        </div>
      </div>
    );
  }
}

function RoomItem({ room }) {
  let canSpectate = true;
  let canJoin = true;
  console.log('room', room);

  if (room.member_count + room.lobby_count >= maxRoomCap) {
    canSpectate = false;
  }

  if (room.member_count >= room.room_size) {
    canJoin = false;
  }

  return (
    <li key={room.id}>
      <p className={styles.roomTitle}>{room.name}</p>
      <span>
        <FontAwesomeIcon icon={faUsers} />
        <b>{`${room.member_count} / ${room.room_size}`}</b>
        {canSpectate ? (
          <a className={classNames(styles.joinButton)} href={room.url}>
            {canJoin ? "Join" : "Spectate"}
          </a>
        ) : (
          <p className={classNames(styles.joinButton, styles.joinButtonDisabled)}>Full</p>
        )}
      </span>
    </li>
  );
}

function Spinner() {
  return (
    <div className="loader-wrap loader-mid">
      <div className="loader">
        <div className="loader-center" />
      </div>
    </div>
  );
}


class MediaTiles extends Component {
  static propTypes = {
    intl: PropTypes.object,
    entries: PropTypes.array,
    hasNext: PropTypes.bool,
    hasPrevious: PropTypes.bool,
    isVariableWidth: PropTypes.bool,
    page: PropTypes.number,
    history: PropTypes.object,
    urlSource: PropTypes.string,
    handleEntryClicked: PropTypes.func,
    handleEntryInfoClicked: PropTypes.func,
    handlePager: PropTypes.func,
    onCopyAvatar: PropTypes.func,
    onCopyScene: PropTypes.func,
    onShowSimilar: PropTypes.func
  };

  handleCopyAvatar = async (e, entry) => {
    e.preventDefault();
    await remixAvatar(entry.id, entry.name);
    this.props.onCopyAvatar();
  };

  handleCopyScene = async (e, entry) => {
    e.preventDefault();
    await fetchReticulumAuthenticated("/api/v1/scenes", "POST", {
      parent_scene_id: entry.id
    });
    this.props.onCopyScene();
  };

  render() {
    const { publicRooms, favoritedRooms } = this.props;
    const { urlSource, hasNext, hasPrevious, page, isVariableWidth } = this.props;
    const entries = this.props.entries || [];
    const [createTileWidth, createTileHeight] = this.getTileDimensions(false, urlSource === "avatars");
    console.log('entries', entries);

    const imageSrc = entries[0].images.preview.url;
    const [imageWidth, imageHeight] = this.getTileDimensions(true, false,  entries[0].images.preview.width / entries[0].images.preview.height);

    console.log('publicRooms', publicRooms);
    console.log('favoritedRooms', favoritedRooms);
    const groupedEntries = groupFeaturedRooms(entries);

    return (
      <div className={styles.body}>
        <div className={classNames({ [styles.tiles]: true, [styles.tilesVariable]: isVariableWidth })}>
          {(urlSource === "avatars" || urlSource === "scenes") && (
            <div
              style={{ width: `${createTileWidth}px`, height: `${createTileHeight}px` }}
              className={classNames({
                [styles.tile]: true,
                [styles.createTile]: true,
                [styles.createAvatarTile]: urlSource === "avatars"
              })}
            >
              {urlSource === "scenes" ? (
                <IfFeature name="enable_spoke">
                  <a href="/spoke/new" rel="noopener noreferrer" target="_blank" className={styles.tileLink}>
                    <div className={styles.tileContent}>
                      <FontAwesomeIcon icon={faPlus} />
                      <FormattedMessage id="media-browser.create-scene" />
                    </div>
                  </a>
                </IfFeature>
              ) : (
                <a
                  onClick={e => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("action_create_avatar"));
                  }}
                  className={styles.tileLink}
                >
                  <div className={styles.tileContent}>
                    <FontAwesomeIcon icon={faPlus} />
                    <FormattedMessage id="media-browser.create-avatar" />
                  </div>
                </a>
              )}
            </div>
          )}

          {/*entries.map(this.entryToTile)*/}

          <div className={styles.contentContainer}>
            {/*<div className={styles.centered} id="virtual-rooms">
              <h1>Virtual Rooms</h1>
            </div>*/}
            {groupedEntries.length > 0 ? (
                   groupedEntries.map(group => <ConferenceRoomGroup key={group.name} group={group} />)
                 ) : (
                   <div className={styles.spinnerContainer}>
                     <Spinner />
                   </div>
                 )}
            {/*<div className={classNames(styles.card, styles.conferenceRoomGroup)}>
              <div className={styles.groupLeft}>
                <h2 id="">
                  Test
                  <a href={"#"} className={styles.groupLink}>
                    <FontAwesomeIcon icon={faLink} />
                  </a>
                </h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <ul className={styles.roomList}>
                  {entries.map(entry => <RoomItem room={entry} />)}
                </ul>
              </div>
              <div className={styles.groupRight}>
                <img alt='Alt' src={scaledThumbnailUrlFor(imageSrc, imageWidth, imageHeight)} />
              </div>
            </div>
            <button
              className={classNames(styles.joinButton, styles.createRoomButton)}
              onClick={e => {
                e.preventDefault();
                createAndRedirectToNewHub(null, null, false);
              }}
            >
              Create Room
            </button>*/}
          </div>






        </div>

        {(hasNext || hasPrevious) &&
          this.props.handlePager && (
            <div className={styles.pager}>
              <a
                className={classNames({ [styles.previousPage]: true, [styles.pagerButtonDisabled]: !hasPrevious })}
                onClick={() => this.props.handlePager(-1)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </a>
              <div className={styles.pageNumber}>{page}</div>
              <a
                className={classNames({ [styles.nextPage]: true, [styles.pagerButtonDisabled]: !hasNext })}
                onClick={() => this.props.handlePager(1)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </a>
            </div>
          )}
      </div>
    );
  }

  getTileDimensions = (isImage, isAvatar, imageAspect) => {
    // Doing breakpointing here, so we can have proper image placeholder based upon dynamic aspect ratio
    const clientWidth = window.innerWidth;
    let imageHeight = clientWidth < 1079 ? (clientWidth < 768 ? (clientWidth < 400 ? 85 : 100) : 150) : 200;
    if (isAvatar) imageHeight = Math.floor(imageHeight * 1.5);

    // Aspect ratio can vary per image if its an image result. Avatars are a taller portrait aspect, o/w assume 720p
    let imageWidth;
    if (isImage) {
      imageWidth = Math.floor(Math.max(imageAspect * imageHeight, imageHeight * 0.85));
    } else if (isAvatar) {
      imageWidth = Math.floor((9 / 16) * imageHeight);
    } else {
      imageWidth = Math.floor(Math.max((16 / 9) * imageHeight, imageHeight * 0.85));
    }

    return [imageWidth, imageHeight];
  };

  entryToTile = (entry, idx) => {
    const imageSrc = entry.images.preview.url;
    const creator = entry.attributions && entry.attributions.creator;
    const isImage = entry.type.endsWith("_image");
    const isAvatar = ["avatar", "avatar_listing"].includes(entry.type);
    const isHub = ["room"].includes(entry.type);
    const imageAspect = entry.images.preview.width / entry.images.preview.height;

    const [imageWidth, imageHeight] = this.getTileDimensions(isImage, isAvatar, imageAspect);

    // Inline mp4s directly since far/nearspark cannot resize them.
    const thumbnailElement =
      entry.images.preview.type === "mp4" ? (
        <video
          className={classNames(styles.tileContent, styles.avatarTile)}
          style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
          muted
          autoPlay
          playsInline
          loop
          src={proxiedUrlFor(imageSrc)}
        />
      ) : (
        <img
          className={classNames(styles.tileContent, styles.avatarTile)}
          style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
          src={scaledThumbnailUrlFor(imageSrc, imageWidth, imageHeight)}
        />
      );

    const publisherName =
      (entry.attributions && entry.attributions.publisher && entry.attributions.publisher.name) ||
      PUBLISHER_FOR_ENTRY_TYPE[entry.type];

    const { formatMessage } = this.props.intl;

    return (
      <div style={{ width: `${imageWidth}px` }} className={styles.tile} key={`${entry.id}_${idx}`}>
        <a
          href={entry.url}
          rel="noreferrer noopener"
          onClick={e => this.props.handleEntryClicked && this.props.handleEntryClicked(e, entry)}
          className={styles.tileLink}
          style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
        >
          {thumbnailElement}
        </a>
        <div className={styles.tileActions}>
          {entry.type === "avatar" && (
            <StateLink
              stateKey="overlay"
              stateValue="avatar-editor"
              stateDetail={{ avatarId: entry.id }}
              history={this.props.history}
              title="Edit"
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </StateLink>
          )}
          {entry.type === "avatar_listing" && (
            <a
              onClick={e => {
                e.preventDefault();
                this.props.onShowSimilar(entry.id, entry.name);
              }}
              title="Show Similar"
            >
              <FontAwesomeIcon icon={faSearch} />
            </a>
          )}
          {entry.type === "avatar_listing" &&
            entry.allow_remixing && (
              <a onClick={e => this.handleCopyAvatar(e, entry)} title="Copy to my avatars">
                <FontAwesomeIcon icon={faClone} />
              </a>
            )}
          {entry.type === "scene_listing" &&
            entry.allow_remixing && (
              <a onClick={e => this.handleCopyScene(e, entry)} title="Copy to my scenes">
                <FontAwesomeIcon icon={faClone} />
              </a>
            )}
          {entry.type === "scene" &&
            entry.project_id && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getReticulumFetchUrl(`/spoke/projects/${entry.project_id}`)}
                title={formatMessage({ id: "scene.edit_button" })}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </a>
            )}
          {entry.type === "room" &&
            this.props.handleEntryInfoClicked &&
            entry.description && (
              <a
                title="room info"
                onClick={e => {
                  e.preventDefault();
                  this.props.handleEntryInfoClicked(entry);
                }}
              >
                <FontAwesomeIcon icon={faInfo} />
              </a>
            )}
        </div>

        {entry.favorited && (
          <div className={styles.favorite}>
            <FontAwesomeIcon icon={faStar} />
          </div>
        )}

        {!entry.type.endsWith("_image") && (
          <div className={styles.info}>
            <a
              href={entry.url}
              rel="noreferrer noopener"
              className={styles.name}
              onClick={e => this.props.handleEntryClicked && this.props.handleEntryClicked(e, entry)}
            >
              {entry.name || "\u00A0"}
            </a>
            {!isAvatar &&
              !isHub && (
                <div className={styles.attribution}>
                  <div className={styles.creator}>
                    {creator && creator.name === undefined && <span>{creator}</span>}
                    {creator && creator.name && !creator.url && <span>{creator.name}</span>}
                    {creator &&
                      creator.name &&
                      creator.url && (
                        <a href={creator.url} target="_blank" rel="noopener noreferrer">
                          {creator.name}
                        </a>
                      )}
                  </div>
                  {publisherName && (
                    <div className={styles.publisher}>
                      <i>
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </i>
                      &nbsp;<a href={entry.url} target="_blank" rel="noopener noreferrer">
                        {publisherName}
                      </a>
                    </div>
                  )}
                </div>
              )}
            {isHub && (
              <>
                <div className={styles.attribution}>
                  <div className={styles.lastJoined}>
                    <FormattedMessage id="media-browser.hub.joined-prefix" />
                    {dayjs(entry.last_activated_at).fromNow()}
                  </div>
                </div>
                <div className={styles.presence}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{entry.member_count}/{entry.room_size}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
}
export default injectIntl(MediaTiles);
