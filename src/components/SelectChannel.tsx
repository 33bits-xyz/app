import React, { useEffect } from "react";
import { useDebounce } from 'use-debounce';

import { Avatar, Button, ScrollView, Table, TableBody, TableDataCell, TableHead, TableHeadCell, TableRow, TextInput, Window, WindowContent, WindowHeader } from 'react95';
import Loader from "./Loader";
import axios from "axios";


export default function SelectChannel({
  onClose,
  onChoose
}: {
  onClose: () => void,
  onChoose: (channel: Channel) => void
}) {
  const [query, setQuery] = React.useState('');
  const [channels, setChannels] = React.useState<Channel[]>([]);

  const loadTrendingChannels = async (): Promise<Channel[]> => {
    const {
      data: {
        channels
      }
    } = await axios.get('https://api.neynar.com/v2/farcaster/channel/trending?time_window=7d', {
      headers: {
        'api_key': 'NEYNAR_API_DOCS'
      }
    });

    return channels;
  }

  const init = async () => {
    const channels = await loadTrendingChannels();

    setChannels(channels);
  };

  useEffect(() => {
    init();
  }, []);

  const channelsRows =
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell disabled>Channel</TableHeadCell>
          <TableHeadCell disabled>Casts</TableHeadCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
          channels.map((channel) => {
            return (
              <TableRow key={channel.channel.id} onClick={() => {
                onChoose(channel);
              }}>
                <TableDataCell>
                  { channel.channel.name }
                </TableDataCell>
                <TableDataCell>
                  { channel.cast_count_30d }
                </TableDataCell>
              </TableRow>
            );
          })
        }
      </TableBody>
    </Table>;

  return (
    <Window className='window' style={{
      width: '115%',
      position: 'absolute',
      top: '-50px',
      left: '-15px',
      zIndex: 2,
    }} >
      <WindowHeader className='window-title'>
        <span>Select channel</span>

        <Button onClick={onClose}>
          <span className='close-icon' />
        </Button>
      </WindowHeader>

      <WindowContent>
        <div style={{ display: 'flex' }}>
          <TextInput
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="mb-3"
            placeholder="Search..."
            fullWidth
          />
        </div>

        <ScrollView style={{ height: '60vh' }}>
          { channelsRows }
        </ScrollView>
      </WindowContent>
    </Window>
  );
}